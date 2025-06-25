export const ACCOUNT_TYPES = [
  '売上高',
  '仕入高',
  '旅費交通費',
  '通信費',
  '水道光熱費',
  '地代家賃',
  '消耗品費',
  '広告宣伝費',
  '外注費',
  '給料手当',
  '支払手数料',
  '福利厚生費',
  '雑収入',
  '雑費',
  'その他',
] as const;

export type AccountType = typeof ACCOUNT_TYPES[number];
