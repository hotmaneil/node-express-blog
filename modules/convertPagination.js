/**
 * 轉換分頁
 */
const convertPagination = function (resource, currentPage) {

  //分頁
  const totalResult = resource.length
  const perpage = 3
  const pageTotal = Math.ceil(totalResult / perpage)
  // let currentPage = 1
  if (currentPage > pageTotal) {
    currentPage = pageTotal
  }

  console.log(
    '總資料筆數',
    totalResult,
    '每頁數量',
    perpage,
    '總頁數',
    pageTotal
  )

  const minStart = currentPage * perpage - perpage + 1
  const maxEnd = currentPage * perpage

  const data = []
  resource.forEach(function (item, index) {
    let itemNum = index + 1
    if (itemNum >= minStart && itemNum <= maxEnd) {
      //  console.log(item.title, index)
      data.push(item)
    }
  })

  const page = {
    pageTotal,
    currentPage,
    hasPre: currentPage > 1,
    hasNext: currentPage < pageTotal
  }

  return{
    page,
  }

  //分頁結束
}

module.exports = convertPagination
