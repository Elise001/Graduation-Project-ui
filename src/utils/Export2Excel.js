import * as XLSX from 'xlsx'
import _ from 'lodash'
import { saveAs } from 'file-saver'

function generateArray(table) {
  const out = []
  const rows = table.querySelectorAll('tr')
  const ranges = []
  for (let R = 0; R < rows.length; ++R) {
    const outRow = []
    const row = rows[R]
    const columns = row.querySelectorAll('td')
    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C]
      let colspan = cell.getAttribute('colspan')
      let rowspan = cell.getAttribute('rowspan')
      let cellValue = cell.innerText
      if (cellValue !== '' && cellValue === +cellValue) cellValue = +cellValue

      // Skip ranges
      ranges.forEach(range => {
        if (
          R >= range.s.r &&
          R <= range.e.r &&
          outRow.length >= range.s.c &&
          outRow.length <= range.e.c
        ) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
        }
      })

      // Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: { r: R, c: outRow.length },
          e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 }
        })
      }
      // Handle Value
      outRow.push(cellValue !== '' ? cellValue : null)

      // Handle Colspan
      if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null)
    }
    out.push(outRow)
  }
  return [out, ranges]
}

function datenum(v, date1904) {
  if (date1904) v += 1462
  const epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data, headerNum, editHeaders) {
  const titleFont = { sz: 11, bold: true }
  const dataFont = { sz: 9 }
  const titleRef = {
    font: titleFont,
    alignment: {
      vertical: 'center',
      horizontal: 'center',
      indent: 0,
      wrapText: true
    },
    border: {
      top: { style: 'thin', color: { auto: 1 }},
      right: { style: 'thin', color: { auto: 1 }},
      bottom: { style: 'thin', color: { auto: 1 }},
      left: { style: 'thin', color: { auto: 1 }}
    }
  }
  const dataRef = {
    font: dataFont,
    alignment: {
      vertical: 'center',
      horizontal: 'center',
      indent: 0,
      wrapText: true
    },
    border: {
      top: { style: 'thin', color: { auto: 1 }},
      right: { style: 'thin', color: { auto: 1 }},
      bottom: { style: 'thin', color: { auto: 1 }},
      left: { style: 'thin', color: { auto: 1 }}
    }
  }
  const ws = {}
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 }}
  for (let R = 0; R !== data.length; ++R) {
    // row
    for (let C = 0; C !== data[R].length; ++C) {
      // col
      // 根据数据长度初始化range
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      // 当前单元格数据-->调整格式
      const cell = { v: data[R][C] }
      if (cell.v === null || cell.v === undefined) cell.v = ''
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R })

      if (typeof cell.v === 'number') cell.t = 'n'
      else if (typeof cell.v === 'boolean') cell.t = 'b'
      else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else cell.t = 's'
      ws[cell_ref] = cell
      // 判断当前格是表头还是数据并添加样式
      ws[cell_ref].s = R <= headerNum - 1 ? titleRef : dataRef
      if (
        editHeaders &&
        editHeaders.length > 0 &&
        _.find(editHeaders, t => t === data[R][C]) &&
        R <= headerNum - 1
      ) {
        ws[cell_ref].s.font.color = { rgb: 'FF0000' } // 红色
      }
    }
  }
  // 根据range定义excel单元格范围
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
  return ws
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}

export function export_table_to_excel(id) {
  const theTable = document.getElementById(id)
  const oo = generateArray(theTable)
  const ranges = oo[1]

  /* original data */
  const data = oo[0]
  const ws_name = 'SheetJS'

  const wb = new Workbook()
  const ws = sheet_from_array_of_arrays(data)

  /* add ranges to worksheet */
  ws['!merges'] = ranges

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })

  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    'test.xlsx'
  )
}

export function export_json_to_excel({
  header,
  data,
  filename = '导出数据',
  autoWidth = true,
  sheetName = 'SheetJS',
  multiHeader = false, // 是否多表头 => 是:[['表头1-1','表头1-2'],['表头2-1','表头2-2']] /否:['表头1','表头2']
  editHeaders, // 自定义列:可编辑列标红(表头名) => [表头1-1','表头1-2']
  merges, // table的merges(用XLSX.utils.table_to_book获取) => XLSX.utils.table_to_book(document.querySelector('#export')).Sheets.Sheet1['!merges']
  hideCol = [] // 隐藏列下标,从0开始 => [0,1,2,6]
} = {}) {
  /* original data */
  let headerNum = 1
  data = [...data]
  if (multiHeader) {
    headerNum = header.length
    for (let i = header.length - 1; i >= 0; i--) {
      data.unshift(header[i])
    }
  } else {
    data.unshift(header)
  }
  const ws_name = sheetName
  const wb = new Workbook()
  const ws = sheet_from_array_of_arrays(data, headerNum, editHeaders)
  if (autoWidth) {
    /* 设置worksheet每列的最大宽度 */
    const maxWidth = 20
    const colWidth = data.map(row =>
      row.map(val => {
        /* 先判断是否为null/undefined */
        if (val === null || val === undefined) {
          return { wch: 10 }
        } else if (val.toString().charCodeAt(0) > 255) {
          /* 再判断是否为中文 */
          return { wch: _.min([val.toString().length * 2, maxWidth]) }
        } else {
          return { wch: _.min([val.toString().length, maxWidth]) }
        }
      })
    )
    /* 以第一行为初始值 */
    const result = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j].wch < colWidth[i][j].wch) {
          if (hideCol.length > 0 && _.findIndex(hideCol, t => t === j) !== -1) {
            result[j].hidden = false
          } else {
            result[j].wch = colWidth[i][j].wch
          }
        }
      }
    }
    ws['!cols'] = result
  }
  if (merges) {
    ws['!merges'] = merges
  }
  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })
  // eslint-disable-next-line no-undef
  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    filename + '.xlsx'
  )
}
