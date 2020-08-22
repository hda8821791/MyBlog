//分頁
const convertPagination = function (resource, currentPage) {
    const totalResult = resource.length; //總筆數
    const perpage = 3; //每頁筆數

    const pageTotal = Math.ceil(totalResult / perpage); //總頁數
    if (currentPage > pageTotal) {
        currentPage = pageTotal
    }

    const minItem = currentPage * perpage - perpage + 1;
    const maxItem = currentPage * perpage;
    const data = [];
    resource.forEach(function (item, i) {
        const itemNum = i + 1;
        if (itemNum >= minItem && itemNum <= maxItem) {
            data.push(item);
        }
    })
    const page = {
        pageTotal,
        currentPage,
        hasPre: currentPage > 1,
        hasNext: currentPage < pageTotal
    }

    return {
        data,
        page
    }
}

module.exports = convertPagination;