// キャラクターのURL用スラッグマッピング
export const characterSlugs: Record<string, string> = {
  SRFQ: 'chicken-master',        // 鶏むね仙人
  SRFL: 'silent-beauty',         // ステルス美活家
  SRCQ: 'pfc-police',           // PFCポリス
  SRCL: 'data-maniac',          // データ変態
  SEFQ: 'whimsical-cat',        // 三日坊主の女王
  SEFL: 'sixth-sense',          // なんとなくヘルシー教
  SECQ: 'night-personality',     // 昼夜二重人格
  SECL: 'knowledge-collector',   // 脳内アスリート
  GRFQ: 'morning-king',         // 朝活マウント王
  GRFL: 'lunch-guardian',       // 女子会ランチの守護神
  GRCQ: 'diet-fighter',         // 減量ファイター
  GRCL: 'diet-manager',         // ダイエット部の部長
  GEFQ: 'trend-surfer',         // トレンドサーファー
  GEFL: 'fashion-dieter',       // 映えダイエッター
  GECQ: 'theory-master',        // 口先番長
  GECL: 'talk-only-ghost'       // 口だけお化け
};

// 逆引き用
export const slugToType: Record<string, string> = Object.fromEntries(
  Object.entries(characterSlugs).map(([key, value]) => [value, key])
);