// 選填欄位可能是空的，舊資料還可能存成 "undefined" / "null" 文字，一律當作沒填
const text = value => (value && value !== 'undefined' && value !== 'null' ? value : '')

// 把後端的救援單位資料轉成卡片和詳細資訊彈窗用的格式（org.vue、member/favorites.vue 共用）
export function toOrgCard (org) {
  const description = text(org.description)
  return {
    _id: org._id,
    title: org.name,
    // 卡片上只顯示前 40 個字，讓卡片高度一致
    short: description.length > 40 ? description.slice(0, 40) + '...' : description,
    detail: description,
    image: org.image,
    category: org.category,
    address: org.address,
    phone: org.phone,
    mail: text(org.mail),
    fb: text(org.fb),
    website: text(org.website),
    openingHours: text(org.openingHours),
  }
}
