const a=()=>!!(navigator.userAgent.toLowerCase().match(/iPad/i)?.length||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1);export{a as isIPad};
