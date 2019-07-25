import storage from 'good-storage'
const RECENTLY_BROWSE = 'browse'  // 最近浏览
// 最近浏览
export const recentlyBrowse = {
    getBrowse() {
        return storage.get(RECENTLY_BROWSE, [])
    },

    setBrowse(data) {
        let newData = this.getBrowse()
        if (newData.length) {
            newData.forEach((item, index) => {
                if (item.id == data.id) {
                    newData.splice(index, 1)
                }
            })
        }
        newData.unshift(data)
        if (newData.length > 30) {  // 最近浏览最多30条缓存
            newData.pop()
        }
        storage.set(RECENTLY_BROWSE, newData)
        return newData
    },

    clearBrowse() {
        return storage.remove(RECENTLY_BROWSE)
    },

    // 删除一条
    deleteOne(id) {
        let data = this.getBrowse()
        const index = data.findIndex((val, ind, arr) => {
            return id == val.id
        })
        data.splice(index, 1)
        storage.set(RECENTLY_BROWSE, data)
        return data
    }
}