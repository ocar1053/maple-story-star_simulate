const enhancementTable = [
    { success: 0.95, destroy: 0, downgrade: 0, maintain: 0.05 }, // 0>1
    { success: 0.90, destroy: 0, downgrade: 0, maintain: 0.10 }, // 1>2
    { success: 0.85, destroy: 0, downgrade: 0, maintain: 0.15 }, // 2>3
    { success: 0.85, destroy: 0, downgrade: 0, maintain: 0.15 }, // 3>4
    { success: 0.80, destroy: 0, downgrade: 0, maintain: 0.20 }, // 4>5
    { success: 0.75, destroy: 0, downgrade: 0, maintain: 0.25 }, // 5>6
    { success: 0.70, destroy: 0, downgrade: 0, maintain: 0.30 }, // 6>7
    { success: 0.65, destroy: 0, downgrade: 0, maintain: 0.35 }, // 7>8
    { success: 0.60, destroy: 0, downgrade: 0, maintain: 0.40 }, // 8>9
    { success: 0.55, destroy: 0, downgrade: 0, maintain: 0.45 }, // 9>10
    { success: 0.50, destroy: 0, downgrade: 0, maintain: 0.50 }, // 10>11
    { success: 0.45, destroy: 0, downgrade: 0, maintain: 0.55 }, // 11>12
    { success: 0.40, destroy: 0, downgrade: 0, maintain: 0.60 }, // 12>13
    { success: 0.35, destroy: 0, downgrade: 0, maintain: 0.65 }, // 13>14
    { success: 0.30, destroy: 0, downgrade: 0, maintain: 0.70 }, // 14>15
    { success: 0.30, destroy: 0.105, downgrade: 0, maintain: 0.595 }, // 15>16
    { success: 0.30, destroy: 0.14, downgrade: 0.56, maintain: 0 },      // 16>17
    { success: 0.30, destroy: 0.21, downgrade: 0.49, maintain: 0 },      // 17>18
    { success: 0.30, destroy: 0.28, downgrade: 0.42, maintain: 0 },      // 18>19
    { success: 0.30, destroy: 0.28, downgrade: 0.42, maintain: 0 },      // 19>20
    { success: 0.30, destroy: 0.35, downgrade: 0, maintain: 0.35 },       // 20>21
    { success: 0.30, destroy: 0.35, downgrade: 0.35, maintain: 0 },       // 21>22
    { success: 0.03, destroy: 0.582, downgrade: 0.388, maintain: 0 },     // 22>23
    { success: 0.02, destroy: 0.588, downgrade: 0.392, maintain: 0 },     // 23>24
    { success: 0.01, destroy: 0.594, downgrade: 0.396, maintain: 0 },     // 24>25
  ];

  export default enhancementTable;