// >0 版本相同 1 高版本 -1 低版本 (当前版本，比较版本)
export default compareVersion = function (version1, version2) {
    const v1 = version1.split(".").map(Number);
    const v2 = version2.split(".").map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = i < v1.length ? v1[i] : 0;
      const num2 = i < v2.length ? v2[i] : 0;
      if (num1 < num2) {
        return -1;
      } else if (num1 > num2) {
        return 1;
      }
    }
    return 0;
}