///@ts-check
const global = {};
global.prim = 0; //何個目の乱数から始めるか
global.maxlen = 50; //何個の乱数表を発生させるか
global.vv = []; //乱数の値
global.vv_b = []; //乱数の値
global.vv_n = -1; //乱数マップ
global.vv_bn = -1; //乱数マップ
global.kouho_vv = []; //レベルアップ候補乱数
global.kouho_vv2 = []; //レベルアップ候補乱数
global.battle_vv = []; //戦闘検索候補乱数位置
global.battle_vv2 = []; //戦闘乱数使用個数
global.search_vv = []; //現在位置検索にヒットした乱数
global.para = ["HP", "力", "魔力", "技", "速さ", "守備", "体格", "幸運", "移動"]; //能力名 表示用
global.prvn = ["mhp", "str", "mag", "skl", "spd", "def", "bld", "luc", "mov"]; //能力名 計算用
global.prct = global.prvn.length; //能力の数
global.ringselect = [0, 0, 0, 0, 0, 0, 0]; //書選択状況
global.rict = global.ringselect.length; //書個数
global.lvupmax = 20; //目標位置検索表示数
global.srchmax = 20; //現在位置検索表示数
global.scalmax = 1; //現在位置検索表示数
global.msp = [
    [
        64, 17, 15, 33, 15, 83, 41, 70, 98, 50, 90, 17, 85, 94, 36, 73, 41, 89, 82, 37, 44, 52, 80, 66, 19, 61, 86, 55, 21, 49,
        53, 53, 55, 80, 26, 95, 25, 40, 74, 32, 85, 50, 96, 75, 81, 75, 61, 13, 14, 18, 74, 93, 13, 7, 84,
    ],
    [
        59, 95, 60, 52, 16, 60, 50, 5, 31, 33, 10, 55, 87, 29, 54, 70, 30, 86, 6, 25, 9, 85, 2, 68, 75, 15, 45, 74, 79, 96, 90,
        55, 37, 21, 58, 95, 36, 90, 98, 44, 60, 18, 61, 100, 32, 80, 25, 13, 55, 4, 63, 24, 54, 100, 62,
    ],
    [
        54, 73, 5, 71, 17, 37, 59, 40, 64, 16, 30, 93, 89, 64, 72, 67, 19, 83, 30, 13, 74, 18, 24, 70, 31, 69, 4, 93, 37, 43, 27,
        57, 19, 62, 90, 95, 47, 40, 22, 56, 35, 86, 26, 25, 83, 85, 89, 13, 96, 90, 52, 55, 95, 93, 40,
    ],
    [
        49, 51, 50, 90, 18, 14, 68, 75, 97, 99, 50, 31, 91, 99, 90, 64, 8, 80, 54, 1, 39, 51, 46, 72, 87, 23, 63, 12, 95, 90, 64,
        59, 1, 3, 22, 95, 58, 90, 46, 68, 10, 54, 91, 50, 34, 90, 53, 13, 37, 76, 41, 86, 36, 86, 18,
    ],
    [
        44, 29, 95, 9, 19, 91, 77, 10, 30, 82, 70, 69, 93, 34, 8, 61, 97, 77, 78, 89, 4, 84, 68, 74, 43, 77, 22, 31, 53, 37, 1,
        61, 83, 44, 54, 95, 69, 40, 70, 80, 85, 22, 56, 75, 85, 95, 17, 13, 78, 62, 30, 17, 77, 79, 96,
    ],
    [
        39, 7, 40, 28, 20, 68, 86, 45, 63, 65, 90, 7, 95, 69, 26, 58, 86, 74, 2, 77, 69, 17, 90, 76, 99, 31, 81, 50, 11, 84, 38,
        63, 65, 85, 86, 95, 80, 90, 94, 92, 60, 90, 21, 100, 36, 100, 81, 13, 19, 48, 19, 48, 18, 72, 74,
    ],
    [
        34, 85, 85, 47, 21, 45, 95, 80, 96, 48, 10, 45, 97, 4, 44, 55, 75, 71, 26, 65, 34, 50, 12, 78, 55, 85, 40, 69, 69, 31, 75,
        65, 47, 26, 18, 95, 91, 40, 18, 4, 35, 58, 86, 25, 87, 5, 45, 13, 60, 34, 8, 79, 59, 65, 52,
    ],
    [
        29, 63, 30, 66, 22, 22, 4, 15, 29, 31, 30, 83, 99, 39, 62, 52, 64, 68, 50, 53, 99, 83, 34, 80, 11, 39, 99, 88, 27, 78, 12,
        67, 29, 67, 50, 95, 2, 90, 42, 16, 10, 26, 51, 50, 38, 10, 9, 13, 1, 20, 97, 10, 100, 58, 30,
    ],
    [
        24, 41, 75, 85, 23, 99, 13, 50, 62, 14, 50, 21, 1, 74, 80, 49, 53, 65, 74, 41, 64, 16, 56, 82, 67, 93, 58, 7, 85, 25, 49,
        69, 11, 8, 82, 95, 13, 40, 66, 28, 85, 94, 16, 75, 89, 15, 73, 13, 42, 6, 86, 41, 41, 51, 8,
    ],
    [
        19, 19, 20, 4, 24, 76, 22, 85, 95, 97, 70, 59, 3, 9, 98, 46, 42, 62, 98, 29, 29, 49, 78, 84, 23, 47, 17, 26, 43, 72, 86,
        71, 93, 49, 14, 95, 24, 90, 90, 40, 60, 62, 81, 100, 40, 20, 37, 13, 83, 92, 75, 72, 82, 44, 86,
    ],
    [
        14, 97, 65, 23, 25, 53, 31, 20, 28, 80, 90, 97, 5, 44, 16, 43, 31, 59, 22, 17, 94, 82, 100, 86, 79, 1, 76, 45, 1, 19, 23,
        73, 75, 90, 46, 95, 35, 40, 14, 52, 35, 30, 46, 25, 91, 25, 1, 13, 24, 78, 64, 3, 23, 37, 64,
    ],
    [
        9, 75, 10, 42, 26, 30, 40, 55, 61, 63, 10, 35, 7, 79, 34, 40, 20, 56, 46, 5, 59, 15, 22, 88, 35, 55, 35, 64, 59, 66, 60,
        75, 57, 31, 78, 95, 46, 90, 38, 64, 10, 98, 11, 50, 42, 30, 65, 13, 65, 64, 53, 34, 64, 30, 42,
    ],
    [
        4, 53, 55, 61, 27, 7, 49, 90, 94, 46, 30, 73, 9, 14, 52, 37, 9, 53, 70, 93, 24, 48, 44, 90, 91, 9, 94, 83, 17, 13, 97, 77,
        39, 72, 10, 95, 57, 40, 62, 76, 85, 66, 76, 75, 93, 35, 29, 13, 6, 50, 42, 65, 5, 23, 20,
    ],
    [
        99, 31, 100, 80, 28, 84, 58, 25, 27, 29, 50, 11, 11, 49, 70, 34, 98, 50, 94, 81, 89, 81, 66, 92, 47, 63, 53, 2, 75, 60,
        34, 79, 21, 13, 42, 95, 68, 90, 86, 88, 60, 34, 41, 100, 44, 40, 93, 13, 47, 36, 31, 96, 46, 16, 98,
    ],
    [
        94, 9, 45, 99, 29, 61, 67, 60, 60, 12, 70, 49, 13, 84, 88, 31, 87, 47, 18, 69, 54, 14, 88, 94, 3, 17, 12, 21, 33, 7, 71,
        81, 3, 54, 74, 95, 79, 40, 10, 100, 35, 2, 6, 25, 95, 45, 57, 13, 88, 22, 20, 27, 87, 9, 76,
    ],
    [
        89, 87, 90, 18, 30, 38, 76, 95, 93, 95, 90, 87, 15, 19, 6, 28, 76, 44, 42, 57, 19, 47, 10, 96, 59, 71, 71, 40, 91, 54, 8,
        83, 85, 95, 6, 95, 90, 90, 34, 12, 10, 70, 71, 50, 46, 50, 21, 13, 29, 8, 9, 58, 28, 2, 54,
    ],
    [
        84, 65, 35, 37, 31, 15, 85, 30, 26, 78, 10, 25, 17, 54, 24, 25, 65, 41, 66, 45, 84, 80, 32, 98, 15, 25, 30, 59, 49, 1, 45,
        85, 67, 36, 38, 95, 1, 40, 58, 24, 85, 38, 36, 75, 97, 55, 85, 13, 70, 94, 98, 89, 69, 95, 32,
    ],
    [
        79, 43, 80, 56, 32, 92, 94, 65, 59, 61, 30, 63, 19, 89, 42, 22, 54, 38, 90, 33, 49, 13, 54, 100, 71, 79, 89, 78, 7, 48,
        82, 87, 49, 77, 70, 95, 12, 90, 82, 36, 60, 6, 1, 100, 48, 60, 49, 13, 11, 80, 87, 20, 10, 88, 10,
    ],
    [
        74, 21, 25, 75, 33, 69, 3, 100, 92, 44, 50, 1, 21, 24, 60, 19, 43, 35, 14, 21, 14, 46, 76, 2, 27, 33, 48, 97, 65, 95, 19,
        89, 31, 18, 2, 95, 23, 40, 6, 48, 35, 74, 66, 25, 99, 65, 13, 13, 52, 66, 76, 51, 51, 81, 88,
    ],
    [
        69, 99, 70, 94, 34, 46, 12, 35, 25, 27, 70, 39, 23, 59, 78, 16, 32, 32, 38, 9, 79, 79, 98, 4, 83, 87, 7, 16, 23, 42, 56,
        91, 13, 59, 34, 95, 34, 90, 30, 60, 10, 42, 31, 50, 50, 70, 77, 13, 93, 52, 65, 82, 92, 74, 66,
    ],
    [
        64, 77, 15, 13, 35, 23, 21, 70, 58, 10, 90, 77, 25, 94, 96, 13, 21, 29, 62, 97, 44, 12, 20, 6, 39, 41, 66, 35, 81, 89, 93,
        93, 95, 100, 66, 95, 45, 40, 54, 72, 85, 10, 96, 75, 1, 75, 41, 13, 34, 38, 54, 13, 33, 67, 44,
    ],
    [
        59, 55, 60, 32, 36, 100, 30, 5, 91, 93, 10, 15, 27, 29, 14, 10, 10, 26, 86, 85, 9, 45, 42, 8, 95, 95, 25, 54, 39, 36, 30,
        95, 77, 41, 98, 95, 56, 90, 78, 84, 60, 78, 61, 100, 52, 80, 5, 13, 75, 24, 43, 44, 74, 60, 22,
    ],
    [
        54, 33, 5, 51, 37, 77, 39, 40, 24, 76, 30, 53, 29, 64, 32, 7, 99, 23, 10, 73, 74, 78, 64, 10, 51, 49, 84, 73, 97, 83, 67,
        97, 59, 82, 30, 95, 67, 40, 2, 96, 35, 46, 26, 25, 3, 85, 69, 13, 16, 10, 32, 75, 15, 53, 100,
    ],
    [
        49, 11, 50, 70, 38, 54, 48, 75, 57, 59, 50, 91, 31, 99, 50, 4, 88, 20, 34, 61, 39, 11, 86, 12, 7, 3, 43, 92, 55, 30, 4,
        99, 41, 23, 62, 95, 78, 90, 26, 8, 10, 14, 91, 50, 54, 90, 33, 13, 57, 96, 21, 6, 56, 46, 78,
    ],
    [
        44, 89, 95, 89, 39, 31, 57, 10, 90, 42, 70, 29, 33, 34, 68, 1, 77, 17, 58, 49, 4, 44, 8, 14, 63, 57, 2, 11, 13, 77, 41, 1,
        23, 64, 94, 95, 89, 40, 50, 20, 85, 82, 56, 75, 5, 95, 97, 13, 98, 82, 10, 37, 97, 39, 56,
    ],
    [
        39, 67, 40, 8, 40, 8, 66, 45, 23, 25, 90, 67, 35, 69, 86, 98, 66, 14, 82, 37, 69, 77, 30, 16, 19, 11, 61, 30, 71, 24, 78,
        3, 5, 5, 26, 95, 100, 90, 74, 32, 60, 50, 21, 100, 56, 100, 61, 13, 39, 68, 99, 68, 38, 32, 34,
    ],
    [
        34, 45, 85, 27, 41, 85, 75, 80, 56, 8, 10, 5, 37, 4, 4, 95, 55, 11, 6, 25, 34, 10, 52, 18, 75, 65, 20, 49, 29, 71, 15, 5,
        87, 46, 58, 95, 11, 40, 98, 44, 35, 18, 86, 25, 7, 5, 25, 13, 80, 54, 88, 99, 79, 25, 12,
    ],
    [
        29, 23, 30, 46, 42, 62, 84, 15, 89, 91, 30, 43, 39, 39, 22, 92, 44, 8, 30, 13, 99, 43, 74, 20, 31, 19, 79, 68, 87, 18, 52,
        7, 69, 87, 90, 95, 22, 90, 22, 56, 10, 86, 51, 50, 58, 10, 89, 13, 21, 40, 77, 30, 20, 18, 90,
    ],
    [
        24, 1, 75, 65, 43, 39, 93, 50, 22, 74, 50, 81, 41, 74, 40, 89, 33, 5, 54, 1, 64, 76, 96, 22, 87, 73, 38, 87, 45, 65, 89,
        9, 51, 28, 22, 95, 33, 40, 46, 68, 85, 54, 16, 75, 9, 15, 53, 13, 62, 26, 66, 61, 61, 11, 68,
    ],
    [
        19, 79, 20, 84, 44, 16, 2, 85, 55, 57, 70, 19, 43, 9, 58, 86, 22, 2, 78, 89, 29, 9, 18, 24, 43, 27, 97, 6, 3, 12, 26, 11,
        33, 69, 54, 95, 44, 90, 70, 80, 60, 22, 81, 100, 60, 20, 17, 13, 3, 12, 55, 92, 2, 4, 46,
    ],
    [
        14, 57, 65, 3, 45, 93, 11, 20, 88, 40, 90, 57, 45, 44, 76, 83, 11, 99, 2, 77, 94, 42, 40, 26, 99, 81, 56, 25, 61, 59, 63,
        13, 15, 10, 86, 95, 55, 40, 94, 92, 35, 90, 46, 25, 11, 25, 81, 13, 44, 98, 44, 23, 43, 97, 24,
    ],
    [
        9, 35, 10, 22, 46, 70, 20, 55, 21, 23, 10, 95, 47, 79, 94, 80, 100, 96, 26, 65, 59, 75, 62, 28, 55, 35, 15, 44, 19, 6,
        100, 15, 97, 51, 18, 95, 66, 90, 18, 4, 10, 58, 11, 50, 62, 30, 45, 13, 85, 84, 33, 54, 84, 90, 2,
    ],
    [
        4, 13, 55, 41, 47, 47, 29, 90, 54, 6, 30, 33, 49, 14, 12, 77, 89, 93, 50, 53, 24, 8, 84, 30, 11, 89, 74, 63, 77, 53, 37,
        17, 79, 92, 50, 95, 77, 40, 42, 16, 85, 26, 76, 75, 13, 35, 9, 13, 26, 70, 22, 85, 25, 83, 80,
    ],
    [
        99, 91, 100, 60, 48, 24, 38, 25, 87, 89, 50, 71, 51, 49, 30, 74, 78, 90, 74, 41, 89, 41, 6, 32, 67, 43, 33, 82, 35, 100,
        74, 19, 61, 33, 82, 95, 88, 90, 66, 28, 60, 94, 41, 100, 64, 40, 73, 13, 67, 56, 11, 16, 66, 76, 58,
    ],
    [
        94, 69, 45, 79, 49, 1, 47, 60, 20, 72, 70, 9, 53, 84, 48, 71, 67, 87, 98, 29, 54, 74, 28, 34, 23, 97, 92, 1, 93, 47, 11,
        21, 43, 74, 14, 95, 99, 40, 90, 40, 35, 62, 6, 25, 15, 45, 37, 13, 8, 42, 100, 47, 7, 69, 36,
    ],
    [
        89, 47, 90, 98, 50, 78, 56, 95, 53, 55, 90, 47, 55, 19, 66, 68, 56, 84, 22, 17, 19, 7, 50, 36, 79, 51, 51, 20, 51, 94, 48,
        23, 25, 15, 46, 95, 10, 90, 14, 52, 10, 30, 71, 50, 66, 50, 1, 13, 49, 28, 89, 78, 48, 62, 14,
    ],
    [
        84, 25, 35, 17, 51, 55, 65, 30, 86, 38, 10, 85, 57, 54, 84, 65, 45, 81, 46, 5, 84, 40, 72, 38, 35, 5, 10, 39, 9, 41, 85,
        25, 7, 56, 78, 95, 21, 40, 38, 64, 85, 98, 36, 75, 17, 55, 65, 13, 90, 14, 78, 9, 89, 55, 92,
    ],
    [
        79, 3, 80, 36, 52, 32, 74, 65, 19, 21, 30, 23, 59, 89, 2, 62, 34, 78, 70, 93, 49, 73, 94, 40, 91, 59, 69, 58, 67, 88, 22,
        27, 89, 97, 10, 95, 32, 90, 62, 76, 60, 66, 1, 100, 68, 60, 29, 13, 31, 100, 67, 40, 30, 48, 70,
    ],
    [
        74, 81, 25, 55, 53, 9, 83, 100, 52, 4, 50, 61, 61, 24, 20, 59, 23, 75, 94, 81, 14, 6, 16, 42, 47, 13, 28, 77, 25, 35, 59,
        29, 71, 38, 42, 95, 43, 40, 86, 88, 35, 34, 66, 25, 19, 65, 93, 13, 72, 86, 56, 71, 71, 41, 48,
    ],
    [
        69, 59, 70, 74, 54, 86, 92, 35, 85, 87, 70, 99, 63, 59, 38, 56, 12, 72, 18, 69, 79, 39, 38, 44, 3, 67, 87, 96, 83, 82, 96,
        31, 53, 79, 74, 95, 54, 90, 10, 100, 10, 2, 31, 50, 70, 70, 57, 13, 13, 72, 45, 2, 12, 34, 26,
    ],
    [
        64, 37, 15, 93, 55, 63, 1, 70, 18, 70, 90, 37, 65, 94, 56, 53, 1, 69, 42, 57, 44, 72, 60, 46, 59, 21, 46, 15, 41, 29, 33,
        33, 35, 20, 6, 95, 65, 40, 34, 12, 85, 70, 96, 75, 21, 75, 21, 13, 54, 58, 34, 33, 53, 27, 4,
    ],
    [
        59, 15, 60, 12, 56, 40, 10, 5, 51, 53, 10, 75, 67, 29, 74, 50, 90, 66, 66, 45, 9, 5, 82, 48, 15, 75, 5, 34, 99, 76, 70,
        35, 17, 61, 38, 95, 76, 90, 58, 24, 60, 38, 61, 100, 72, 80, 85, 13, 95, 44, 23, 64, 94, 20, 82,
    ],
    [
        54, 93, 5, 31, 57, 17, 19, 40, 84, 36, 30, 13, 69, 64, 92, 47, 79, 63, 90, 33, 74, 38, 4, 50, 71, 29, 64, 53, 57, 23, 7,
        37, 99, 2, 70, 95, 87, 40, 82, 36, 35, 6, 26, 25, 23, 85, 49, 13, 36, 30, 12, 95, 35, 13, 60,
    ],
    [
        49, 71, 50, 50, 58, 94, 28, 75, 17, 19, 50, 51, 71, 99, 10, 44, 68, 60, 14, 21, 39, 71, 26, 52, 27, 83, 23, 72, 15, 70,
        44, 39, 81, 43, 2, 95, 98, 90, 6, 48, 10, 74, 91, 50, 74, 90, 13, 13, 77, 16, 1, 26, 76, 6, 38,
    ],
    [
        44, 49, 95, 69, 59, 71, 37, 10, 50, 2, 70, 89, 73, 34, 28, 41, 57, 57, 38, 9, 4, 4, 48, 54, 83, 37, 82, 91, 73, 17, 81,
        41, 63, 84, 34, 95, 9, 40, 30, 60, 85, 42, 56, 75, 25, 95, 77, 13, 18, 2, 90, 57, 17, 99, 16,
    ],
    [
        39, 27, 40, 88, 60, 48, 46, 45, 83, 85, 90, 27, 75, 69, 46, 38, 46, 54, 62, 97, 69, 37, 70, 56, 39, 91, 41, 10, 31, 64,
        18, 43, 45, 25, 66, 95, 20, 90, 54, 72, 60, 10, 21, 100, 76, 100, 41, 13, 59, 88, 79, 88, 58, 92, 94,
    ],
    [
        34, 5, 85, 7, 61, 25, 55, 80, 16, 68, 10, 65, 77, 4, 64, 35, 35, 51, 86, 85, 34, 70, 92, 58, 95, 45, 100, 29, 89, 11, 55,
        45, 27, 66, 98, 95, 31, 40, 78, 84, 35, 78, 86, 25, 27, 5, 5, 13, 100, 74, 68, 19, 99, 85, 72,
    ],
    [
        29, 83, 30, 26, 62, 2, 64, 15, 49, 51, 30, 3, 79, 39, 82, 32, 24, 48, 10, 73, 99, 3, 14, 60, 51, 99, 59, 48, 47, 58, 92,
        47, 9, 7, 30, 95, 42, 90, 2, 96, 10, 46, 51, 50, 78, 10, 69, 13, 41, 60, 57, 50, 40, 78, 50,
    ],
    [
        24, 61, 75, 45, 63, 79, 73, 50, 82, 34, 50, 41, 81, 74, 100, 29, 13, 45, 34, 61, 64, 36, 36, 62, 7, 53, 18, 67, 5, 5, 29,
        49, 91, 48, 62, 95, 53, 40, 26, 8, 85, 14, 16, 75, 29, 15, 33, 13, 82, 46, 46, 81, 81, 71, 28,
    ],
    [
        19, 39, 20, 64, 64, 56, 82, 85, 15, 17, 70, 79, 83, 9, 18, 26, 2, 42, 58, 49, 29, 69, 58, 64, 63, 7, 77, 86, 63, 52, 66,
        51, 73, 89, 94, 95, 64, 90, 50, 20, 60, 82, 81, 100, 80, 20, 97, 13, 23, 32, 35, 12, 22, 64, 6,
    ],
    [
        14, 17, 65, 83, 65, 33, 91, 20, 48, 100, 90, 17, 85, 44, 36, 23, 91, 39, 82, 37, 94, 2, 80, 66, 19, 61, 36, 5, 21, 99, 3,
        53, 55, 30, 26, 95, 75, 40, 74, 32, 35, 50, 46, 25, 31, 25, 61, 13, 64, 18, 24, 43, 63, 57, 84,
    ],
    [
        9, 95, 10, 2, 66, 10, 100, 55, 81, 83, 10, 55, 87, 79, 54, 20, 80, 36, 6, 25, 59, 35, 2, 68, 75, 15, 95, 24, 79, 46, 40,
        55, 37, 71, 58, 95, 86, 90, 98, 44, 10, 18, 11, 50, 82, 30, 25, 13, 5, 4, 13, 74, 4, 50, 62,
    ],
    [
        4, 73, 55, 21, 67, 87, 9, 90, 14, 66, 30, 93, 89, 14, 72, 17, 69, 33, 30, 13, 24, 68, 24, 70, 31, 69, 54, 43, 37, 93, 77,
        57, 19, 12, 90, 95, 97, 40, 22, 56, 85, 86, 76, 75, 33, 35, 89, 13, 46, 90, 2, 5, 45, 43, 40,
    ],
    [
        99, 51, 100, 40, 68, 64, 18, 25, 47, 49, 50, 31, 91, 49, 90, 14, 58, 30, 54, 1, 89, 1, 46, 72, 87, 23, 13, 62, 95, 40, 14,
        59, 1, 53, 22, 95, 8, 90, 46, 68, 60, 54, 41, 100, 84, 40, 53, 13, 87, 76, 91, 36, 86, 36, 18,
    ],
    [
        94, 29, 45, 59, 69, 41, 27, 60, 80, 32, 70, 69, 93, 84, 8, 11, 47, 27, 78, 89, 54, 34, 68, 74, 43, 77, 72, 81, 53, 87, 51,
        61, 83, 94, 54, 95, 19, 40, 70, 80, 35, 22, 6, 25, 35, 45, 17, 13, 28, 62, 80, 67, 27, 29, 96,
    ],
    [
        89, 7, 90, 78, 70, 18, 36, 95, 13, 15, 90, 7, 95, 19, 26, 8, 36, 24, 2, 77, 19, 67, 90, 76, 99, 31, 31, 100, 11, 34, 88,
        63, 65, 35, 86, 95, 30, 90, 94, 92, 10, 90, 71, 50, 86, 50, 81, 13, 69, 48, 69, 98, 68, 22, 74,
    ],
    [
        84, 85, 35, 97, 71, 95, 45, 30, 46, 98, 10, 45, 97, 54, 44, 5, 25, 21, 26, 65, 84, 100, 12, 78, 55, 85, 90, 19, 69, 81,
        25, 65, 47, 76, 18, 95, 41, 40, 18, 4, 85, 58, 36, 75, 37, 55, 45, 13, 10, 34, 58, 29, 9, 15, 52,
    ],
    [
        79, 63, 80, 16, 72, 72, 54, 65, 79, 81, 30, 83, 99, 89, 62, 2, 14, 18, 50, 53, 49, 33, 34, 80, 11, 39, 49, 38, 27, 28, 62,
        67, 29, 17, 50, 95, 52, 90, 42, 16, 60, 26, 1, 100, 88, 60, 9, 13, 51, 20, 47, 60, 50, 8, 30,
    ],
    [
        74, 41, 25, 35, 73, 49, 63, 100, 12, 64, 50, 21, 1, 24, 80, 99, 3, 15, 74, 41, 14, 66, 56, 82, 67, 93, 8, 57, 85, 75, 99,
        69, 11, 58, 82, 95, 63, 40, 66, 28, 35, 94, 66, 25, 39, 65, 73, 13, 92, 6, 36, 91, 91, 1, 8,
    ],
    [
        69, 19, 70, 54, 74, 26, 72, 35, 45, 47, 70, 59, 3, 59, 98, 96, 92, 12, 98, 29, 79, 99, 78, 84, 23, 47, 67, 76, 43, 22, 36,
        71, 93, 99, 14, 95, 74, 90, 90, 40, 10, 62, 31, 50, 90, 70, 37, 13, 33, 92, 25, 22, 32, 94, 86,
    ],
    [
        64, 97, 15, 73, 75, 3, 81, 70, 78, 30, 90, 97, 5, 94, 16, 93, 81, 9, 22, 17, 44, 32, 100, 86, 79, 1, 26, 95, 1, 69, 73,
        73, 75, 40, 46, 95, 85, 40, 14, 52, 85, 30, 96, 75, 41, 75, 1, 13, 74, 78, 14, 53, 73, 87, 64,
    ],
    [
        59, 75, 60, 92, 76, 80, 90, 5, 11, 13, 10, 35, 7, 29, 34, 90, 70, 6, 46, 5, 9, 65, 22, 88, 35, 55, 85, 14, 59, 16, 10, 75,
        57, 81, 78, 95, 96, 90, 38, 64, 60, 98, 61, 100, 92, 80, 65, 13, 15, 64, 3, 84, 14, 80, 42,
    ],
    [
        54, 53, 5, 11, 77, 57, 99, 40, 44, 96, 30, 73, 9, 64, 52, 87, 59, 3, 70, 93, 74, 98, 44, 90, 91, 9, 44, 33, 17, 63, 47,
        77, 39, 22, 10, 95, 7, 40, 62, 76, 35, 66, 26, 25, 43, 85, 29, 13, 56, 50, 92, 15, 55, 73, 20,
    ],
    [
        49, 31, 50, 30, 78, 34, 8, 75, 77, 79, 50, 11, 11, 99, 70, 84, 48, 100, 94, 81, 39, 31, 66, 92, 47, 63, 3, 52, 75, 10, 84,
        79, 21, 63, 42, 95, 18, 90, 86, 88, 10, 34, 91, 50, 94, 90, 93, 13, 97, 36, 81, 46, 96, 66, 98,
    ],
];
global.randmap = global.msp.length; //乱数マップの数

global.rasu = [
    39, 38, 33, 29, 24, 21, 20, 16, 13, 9, 8, 4, 1, 61, 58, 57, 53, 50, 46, 45, 41, 36, 31, 27, 26, 23, 19, 15, 12, 11, 7, 3, 0,
    63, 60, 56, 52, 49, 48, 44, 40, 35, 34, 30, 25, 22, 18, 17, 14, 10, 6, 5, 2, 62, 59, 55, 54, 51, 47, 43, 42, 37, 32, 28,
];
global.pika = [
    0, 25, 50, 1, 26, 51, 2, 27, 52, 3, 28, 53, 4, 29, 54, 5, 30, 55, 6, 31, 56, 7, 32, 57, 8, 33, 58, 9, 34, 59, 10, 35, 60, 11,
    36, 61, 12, 37, 62, 13, 38, 63, 14, 39, 15, 40, 16, 41, 17, 42, 18, 43, 19, 44, 20, 45, 21, 46, 22, 47, 23, 48, 24, 49,
];
global.pika2 = [
    0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 1, 4, 7, 10, 13, 16, 19, 22,
    25, 28, 31, 34, 37, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41,
];

global.svv_tora = [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0];
//成長率
global.ud = [
    ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["リーフ", 70, 35, 10, 35, 40, 25, 15, 40, 3, 5],
    ["フィン", 60, 35, 5, 30, 35, 30, 10, 45, 1, 0],
    ["エーヴェル", 30, 15, 10, 15, 10, 5, 5, 25, 1, 10],
    ["オーシン", 85, 30, 5, 25, 35, 25, 25, 55, 2, 0],
    ["ハルヴァン", 80, 40, 5, 20, 30, 30, 30, 30, 2, 0],
    ["マーティ", 90, 15, 5, 10, 15, 40, 75, 50, 2, 0],
    ["ダグダ", 15, 10, 5, 10, 10, 10, 5, 30, 1, 5],
    ["タニア", 60, 35, 15, 55, 70, 15, 5, 60, 2, 0],
    ["ロナン", 40, 15, 55, 45, 55, 5, 2, 20, 3, 15],
    ["リフィス", 65, 35, 10, 25, 45, 15, 10, 5, 2, 10],
    ["サフィ", 35, 30, 60, 45, 40, 3, 2, 5, 0, 0],
    ["フェルグス", 65, 35, 10, 45, 35, 25, 20, 40, 1, 5],
    ["カリン", 55, 30, 15, 35, 70, 15, 5, 70, 2, 0],
    ["ブライトン", 70, 30, 5, 25, 30, 35, 20, 15, 1, 0],
    ["マチュア", 60, 30, 10, 55, 60, 25, 10, 35, 2, 0],
    ["ラーラ", 45, 10, 10, 50, 70, 20, 5, 60, 3, 5],
    ["ダルシン", 60, 50, 5, 40, 25, 20, 25, 25, 2, 0],
    ["アスベル", 55, 10, 35, 55, 75, 10, 10, 35, 2, 5],
    ["ナンナ", 50, 25, 10, 40, 35, 15, 10, 55, 1, 0],
    ["ヒックス", 80, 35, 5, 40, 30, 30, 30, 55, 1, 0],
    ["シヴァ", 70, 45, 5, 50, 35, 30, 20, 60, 2, 5],
    ["カリオン", 75, 40, 10, 65, 45, 25, 25, 55, 1, 5],
    ["セルフィナ", 50, 25, 10, 40, 35, 15, 10, 55, 1, 0],
    ["ケイン", 75, 55, 5, 40, 35, 35, 30, 50, 1, 0],
    ["アルバ", 70, 40, 10, 45, 50, 30, 25, 65, 1, 0],
    ["ロベルト", 65, 45, 10, 50, 60, 25, 20, 70, 1, 5],
    ["フレッド", 75, 60, 15, 40, 35, 35, 25, 25, 1, 0],
    ["オルエン", 50, 40, 45, 55, 50, 15, 10, 70, 1, 5],
    ["マリータ", 65, 60, 15, 75, 80, 20, 10, 60, 3, 5],
    ["セイラム", 60, 5, 30, 45, 40, 15, 15, 10, 2, 0],
    ["パーン", 65, 40, 10, 45, 65, 25, 10, 70, 2, 25],
    ["ティナ", 40, 3, 50, 25, 65, 5, 5, 90, 5, 25],
    ["トルード", 90, 35, 5, 45, 35, 30, 20, 60, 2, 5],
    ["グレイド", 60, 45, 5, 35, 35, 30, 15, 35, 1, 0],
    ["ディーン", 75, 55, 5, 50, 30, 30, 30, 40, 1, 10],
    ["エダ", 60, 40, 20, 35, 60, 20, 5, 30, 1, 0],
    ["ホメロス", 65, 0, 40, 70, 70, 15, 10, 55, 3, 5],
    ["リノアン", 50, 3, 45, 60, 55, 10, 5, 55, 2, 0],
    ["ラルフ", 60, 35, 5, 30, 20, 35, 35, 15, 1, 0],
    ["イリオス", 50, 40, 45, 55, 50, 15, 10, 70, 1, 5],
    ["スルーフ", 35, 3, 40, 75, 45, 10, 10, 25, 2, 15],
    ["サラ", 40, 0, 80, 80, 80, 10, 5, 40, 3, 25],
    ["ミランダ", 60, 5, 70, 55, 70, 15, 5, 35, 2, 0],
    ["シャナム", 50, 50, 5, 5, 50, 5, 5, 50, 2, 0],
    ["ミーシャ", 65, 55, 15, 65, 80, 20, 5, 40, 1, 5],
    ["ゼーベイア", 50, 40, 45, 55, 50, 15, 10, 70, 1, 0],
    ["アマルダ", 70, 55, 15, 50, 45, 25, 15, 60, 1, 5],
    ["コノモール", 70, 60, 5, 35, 50, 20, 20, 20, 1, 5],
    ["デルムッド", 70, 40, 15, 65, 45, 30, 15, 65, 2, 0],
    ["サイアス", 50, 0, 35, 40, 40, 15, 10, 55, 2, 15],
    ["セティ", 75, 10, 75, 75, 80, 20, 15, 65, 1, 10],
    ["ガルザス", 50, 40, 45, 55, 50, 15, 10, 70, 1, 25],
];
global.ring = [
    ["なし", 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ["ヘズルの書", 30, 10, 0, 0, 0, 0, 0, -10, 0],
    ["バルドの書", 5, 5, 0, 5, 5, 5, 0, 5, 0],
    ["セティの書", -10, 0, 10, 0, 30, 0, 0, 0, 0],
    ["オードの書", 0, 0, 0, 30, 0, 0, 0, 0, 0],
    ["ネールの書", 10, 10, 0, -10, 0, 10, 10, 0, 0],
    ["ファラの書", 0, 5, 5, 10, 10, 0, 0, 0, 0],
    ["ヘイムの書", 0, 0, 30, 0, 0, -10, 0, 10, 0],
    ["ダインの書", 0, 5, 0, 0, -10, 30, 0, 0, 5],
    ["ウルの書", 0, 0, 0, 10, 10, 0, 0, 10, 0],
    ["ブラギの書", 0, -10, 10, 0, 0, 0, 0, 30, 0],
    ["ノヴァの書", 0, 30, -10, 0, 10, 5, 0, -5, 0],
    ["トードの書", 5, 5, 5, 10, 0, 0, 0, 5, 0],
];
global.unitindex = 1; //初期選択ユニット
global.skilllist = [
    "怒り",
    "祈り",
    "大盾",
    "待ち伏せ",
    "月光",
    "太陽",
    "流星",
    "連続",
    "勇者",
    "突撃",
    "無敵",
    "吸収",
    "呪い",
    "眠り",
    "毒",
]; //スキル
global.skilln = global.skilllist.length;
function rand_calc(data) {
    //乱数計算
    var i;
    for (i = 54; i >= 0; i--) {
        data[(i + 24) % 55] = ((99 + data[(i + 24) % 55] - data[i]) % 100) + 1;
    }
    for (i = 0; i < 7; i++) {
        data[i + 48] = ((data[i + 48] + data[i] - 1) % 100) + 1;
    }
}
function rand_ins(data) {
    //乱数を配列に入れる
    global.vv = [];
    global.vv = global.vv.concat(data);
    for (var i = 0; i <= global.maxlen; i++) {
        rand_calc(data);
        global.vv = global.vv.concat(data);
    }
}
function init() {
    //初期化
    pikasort(0);
    createTable(0);
    ch_OnChange(0);
    search_m_onchange();
    reset();
    document.getElementById("mainwindow").style.visibility = "visible";
}
function next() {
    //次の乱数
    var nn = global.maxlen;
    nn = parseInt(document.getElementById("rand_max").value);
    if (isNaN(nn)) {
        nn = global.maxlen;
    }
    if (nn < 0) {
        nn = 0;
    }
    if (
        nn < 501 ||
        window.confirm("乱数を" + (global.prim + global.maxlen) + "個からの" + nn + "個に変更します。\nよろしいですか？")
    ) {
        global.vv_n = -1;
        global.vv_bn = -1;
        global.prim += global.maxlen;
        global.maxlen = nn;
        reset();
    } else {
        document.getElementById("rand_max").value = global.maxlen;
        document.getElementById("rand_start").value = global.prim;
    }
}
function reset() {
    //再設定
    document.getElementById("rand_start").value = global.prim;
    document.getElementById("rand_max").value = global.maxlen;
    document.getElementById("view_val").value = 0;
    change_map(0, 0);
    kouho_next(1);
}
function change_max() {
    //乱数の個数変更
    var np = global.prim;
    var nn = global.maxlen;
    np = parseInt(document.getElementById("rand_start").value);
    nn = parseInt(document.getElementById("rand_max").value);
    if (isNaN(np)) {
        np = global.prim;
    }
    if (isNaN(nn)) {
        nn = global.maxlen;
    }
    if (np < 0) {
        np = 0;
    }
    if (nn < 0) {
        nn = 0;
    }
    if (nn < 501 || window.confirm("乱数を" + np + "個からの" + nn + "個に変更します。\nよろしいですか？")) {
        global.vv_n = -1;
        global.vv_bn = -1;
        global.prim = np;
        global.maxlen = nn;
        reset();
    } else {
        document.getElementById("rand_max").value = global.maxlen;
        document.getElementById("rand_start").value = global.prim;
    }
}
function mapselected(f) {
    if (f ^ document.getElementById("pikacheck").checked) {
        return global.pika[document.getElementById("seed").selectedIndex];
    } else {
        return document.getElementById("seed").selectedIndex;
    }
}
function mapselect(m) {
    if (document.getElementById("pikacheck").checked) {
        document.getElementById("seed").selectedIndex = global.pika2[m];
    } else {
        document.getElementById("seed").selectedIndex = m;
    }
}
function pikasort(f) {
    var ret = [];
    var map = f ? mapselected(1) : 30;
    var i;
    if (document.getElementById("pikacheck").checked) {
        for (i = 0; i < global.randmap; i++) {
            ret.push("<option>" + global.pika[i] + "</option>");
        }
    } else {
        for (i = 0; i < global.randmap; i++) {
            ret.push("<option>" + i + "</option>");
        }
    }
    document.getElementById("map").innerHTML = '<select id="seed" onchange="change_map(0,0);">' + ret.join("") + "</select>";
    mapselect(map);
}
function map_swap() {
    if (global.vv_bn < 0) {
        1;
    } else {
        mapselect(global.vv_bn);
        change_map(0, 0);
    }
}
function change_map(f, m) {
    if (f) {
        document.getElementById("search_dtb").checked = 1;
        mapselect(m);
        document.getElementById("view_val").value = 0;
        document.getElementById("lv_val").value = 0;
    }
    var map = mapselected(0);
    if (global.vv_n == map) {
        1;
    } else if (global.vv_bn == map) {
        var buf = global.vv;
        global.vv = global.vv_b;
        global.vv_b = buf;
        global.vv_bn = global.vv_n;
        global.vv_n = map;
    } else {
        if (global.vv_n != -1) {
            global.vv_b = [];
            global.vv_b = global.vv_b.concat(global.vv);
            global.vv_bn = global.vv_n;
        }
        var data = [];
        data = data.concat(global.msp[map]);
        for (var i = 0; i < global.prim; i++) {
            rand_calc(data);
        }
        rand_ins(data);
        global.vv_n = map;
    }
    if (global.vv_bn < 0) {
        document.getElementById("mapsw").value = "--";
    } else {
        document.getElementById("mapsw").value = String(global.vv_bn + 100).slice(1);
    }
    Change_type();
    search_m_onchange();
    if (f) {
        search_updown(1);
        kouho_next(1);
    }
    document.getElementById("bt_kouho").innerHTML = "未検索";
}
function Change_type() {
    if (document.getElementById("search_type").selectedIndex == 0) {
        calc_lvlup_lv(1);
    } else if (document.getElementById("search_type").selectedIndex == 1) {
        global.kouho_vv = global.battle_vv;
        kouho_show(global.kouho_vv);
    } else if (document.getElementById("search_type").selectedIndex == 2) {
        calc_lvlup_lv(0);
    } else if (document.getElementById("search_type").selectedIndex == 3) {
        search_thread();
    }
    document.getElementById("rasucmpt").innerHTML = global.rasu[mapselected(0)];
    view_val_f();
    lv_val_f();
}
function view_val_f() {
    //現在位置
    var i;
    var sp;
    var st;
    var index = parseInt(document.getElementById("view_val").value) - global.prim * 55;
    if (isNaN(index) || index < 1) {
        index = 1;
    }
    var ret = [];
    if (index > global.maxlen * 55) {
        index = global.maxlen * 55;
    }
    document.getElementById("view_val").value = index + global.prim * 55;
    for (i = 0; i < 30; i++) {
        st = String(global.vv[index + i] + 99).slice(1);
        if (ox(global.vv[index + i])) {
            st = "<span class=maru>" + st + "</span>";
        } else {
            st = "<span class=batsu>" + st + "</span>";
        }
        ret.push(st);
    }
    document.getElementById("view_val_v").innerHTML = ret.join(" ");
    ret = [];
    sp = Math.floor(index / 55);
    for (i = 0; i < 1; i++) {
        ret.push(randtable(sp + i, index, -1));
    }
    document.getElementById("map_val_n").innerHTML = ret.join("<br>");
    sub_val_f();
    lvup(0, 0);
    yosoku();
}
function view_val_updown(v) {
    document.getElementById("view_val").value -= -v;
    view_val_f();
}
function lv_val_glance() {
    //目標位置先読み
    var index;
    index = parseInt(document.getElementById("lv_val").value) - global.prim * 55;
    if (document.getElementById("glance_ck").checked) {
        index += document.getElementById("glance").selectedIndex - 999;
    }
    return index;
}
function glance_a() {
    //先読み反映
    var index;
    index = parseInt(document.getElementById("lv_val").value);
    index += document.getElementById("glance").selectedIndex - 999;
    document.getElementById("lv_val").value = index;
    document.getElementById("glance_ck").checked = 0;
    lv_val_f();
}
function lv_val_f() {
    //目標位置
    var i;
    var sp;
    var st;
    var ret = [];
    var index = parseInt(document.getElementById("lv_val").value) - global.prim * 55;
    if (isNaN(index) || index < 1) {
        index = 1;
    }
    if (index <= 0) {
        index = 0;
    }
    if (index > global.maxlen * 55) {
        index = global.maxlen * 55;
    }
    document.getElementById("lv_val").value = index + global.prim * 55;
    index = lv_val_glance();
    for (i = 0; i < 30; i++) {
        if (index + i < 0 || index + i > global.maxlen * 55 + 55) {
            ret.push("--");
        } else {
            st = String(global.vv[index + i] + 99).slice(1);
            if (ox(global.vv[index + i])) {
                st = "<span class=maru>" + st + "</span>";
            } else {
                st = "<span class=batsu>" + st + "</span>";
            }
            ret.push(st);
        }
    }
    document.getElementById("lv_val_v").innerHTML = ret.join(" ");
    ret = [];
    sp = Math.floor(index / 55);
    for (i = 0; i < 2; i++) {
        ret.push(randtable(sp + i, index, -1));
    }
    document.getElementById("map_val_t").innerHTML = ret.join("<br>");
    sub_val_f();
    battle();
}
function lv_val_updown(v) {
    document.getElementById("lv_val").value -= -v;
    lv_val_f();
}
function sub_val_f() {
    //差
    var i;
    var val, hfal, vfal;
    var fc, ft;
    var mv = document.getElementById("mv").selectedIndex;
    var start = parseInt(document.getElementById("view_val").value) - global.prim * 55;
    var last = lv_val_glance();
    var len = last - start;
    document.getElementById("sub_val").innerHTML = len;
    if (len < 0 || last > global.maxlen * 55 + 55) {
        document.getElementById("sub_hfal").innerHTML = "　　　";
        document.getElementById("sub_vfal").innerHTML = "　　　";
        return false;
    }
    fc = 0;
    ft = 0;
    lvv = 0;
    for (i = 0; i < len; i++) {
        if (ox(global.vv[start + i]) && fc < mv) {
            fc++;
        } else {
            ft++;
            fc = 0;
            lvv = i + 1;
        }
    }
    document.getElementById("sub_hfal").innerHTML = ft;
    if (i - lvv) {
        document.getElementById("sub_hfal").innerHTML += "(+" + (i - lvv) + ")";
    } else {
        document.getElementById("sub_hfal").innerHTML += "　 　";
    }
    fc = 0;
    ft = 0;
    lvv = 0;
    for (i = 0; i < len; i++) {
        if (ox(global.vv[start + i]) || fc >= mv) {
            ft++;
            fc = 0;
            lvv = i + 1;
        } else {
            fc++;
        }
    }
    document.getElementById("sub_vfal").innerHTML = ft;
    if (i - lvv) {
        document.getElementById("sub_vfal").innerHTML += "(+" + (i - lvv) + ")";
    } else {
        document.getElementById("sub_vfal").innerHTML += "　 　";
    }
}
function addw(i, v) {
    if (i < 0 || i > global.maxlen * 55 + 55) {
        return undefined;
    }
    return (
        "[" +
        v +
        "] 値：" +
        String(global.vv[i] + 99).slice(1) +
        " 位置：" +
        (i + global.prim * 55) +
        " (No." +
        Math.floor(i / 55 + global.prim + 1) +
        " " +
        ["A", "B", "C"][Math.floor((i % 55) / 24)] +
        (((i % 55) % 24) + 1) +
        ")"
    );
}
function lvup(flag, v) {
    //上昇量表示
    var i;
    var u;
    var up;
    var gr;
    if (flag) {
        index = lv_val_glance();
        var plsp = parseInt(document.getElementById("pls").value);
        if (isNaN(plsp)) {
            document.getElementById("pls").value = plsp = 0;
        }
    } else {
        index = parseInt(document.getElementById("view_val").value) - global.prim * 55;
    }
    index += parseInt(v);
    for (i = 0; i < global.prct; i++) {
        gr = parseInt(document.getElementById(global.prvn[i]).value);
        if (isNaN(gr) || gr < 0) {
            gr = 0;
        }
        u = Math.floor(gr / 100);
        up = u;
        gr %= 100;
        if (global.vv[index + i] <= gr) {
            up++;
        }
        if (flag) {
            if (index + i < 0 || index + i > global.maxlen * 55 + 55) {
                document.getElementById(global.prvn[i] + "pm").innerHTML = "---";
                document.getElementById(global.prvn[i] + "pm").title = "---";
            } else {
                document.getElementById(global.prvn[i] + "pm").innerHTML = up ? "+" + up : "";
                document.getElementById(global.prvn[i] + "pm").title = addw(index + i, global.para[i] + "+" + up);
            }
            if (index + plsp + i < 0 || index + plsp + i > global.maxlen * 55 + 55) {
                document.getElementById(global.prvn[i] + "pp").innerHTML = "---";
                document.getElementById(global.prvn[i] + "pp").title = "---";
            } else {
                up = u;
                if (global.vv[index + plsp + i] <= gr) {
                    up++;
                }
                document.getElementById(global.prvn[i] + "pp").innerHTML = up ? "+" + up : "";
                document.getElementById(global.prvn[i] + "pp").title = addw(index + plsp + i, global.para[i] + "+" + up);
            }
        } else {
            document.getElementById(global.prvn[i] + "pl").innerHTML = up ? "+" + up : "";
            document.getElementById(global.prvn[i] + "pl").title = addw(index + i, global.para[i] + "+" + up);
        }
    }
    gr = parseInt(document.getElementById("react").value);
    if (isNaN(gr)) {
        gr = 0;
    }
    up = 0;
    if (global.vv[index + global.prct] <= gr) {
        up++;
    }
    if (flag) {
        document.getElementById("reactpm").innerHTML = up ? "○" : "×";
        document.getElementById("reactpm").title = addw(index + i, "♪:" + (up ? "○" : "×"));
        if (index + plsp + i < 0 || index + plsp + i > global.maxlen * 55 + 55) {
            document.getElementById("reactpp").innerHTML = "---";
            document.getElementById("reactpm").title = "---";
        } else {
            up = 0;
            if (global.vv[index + plsp + global.prct] <= gr) {
                up++;
            }
            document.getElementById("reactpp").innerHTML = up ? "○" : "×";
            document.getElementById("reactpp").title = addw(index + plsp + i, "♪:" + (up ? "○" : "×"));
        }
    } else {
        document.getElementById("reactpl").innerHTML = up ? "○" : "×";
        document.getElementById("reactpl").title = addw(index + i, "♪:" + (up ? "○" : "×"));
    }
}
function ch_OnChange(flag) {
    //ユニット選択変更
    var i;
    var j = document.getElementById("unitname").selectedIndex;
    for (i = 0; i < global.prct; i++) {
        document.getElementById(global.prvn[i]).value = global.ud[j][i + 1];
    }
    document.getElementById("react").value = global.ud[j][global.prct + 1];
    for (i = 0; i < global.rict; i++) {
        global.ringselect[i] = 0;
    }
    afua_change();
    if (flag) {
        if (document.getElementById("search_type").selectedIndex != 2) {
            document.getElementById("search_type").selectedIndex = 0;
        }
        calc_lvlup();
    }
}
function afua_change() {
    //聖戦士の書
    var i, j;
    var o, n;
    var pr = [];
    for (j = 0; j < global.prct; j++) {
        pr[j] = parseInt(document.getElementById(global.prvn[j]).value);
    }
    for (i = 0; i < global.rict; i++) {
        o = global.ringselect[i];
        n = document.getElementById("afua" + i).selectedIndex;
        for (j = 0; j < global.prct; j++) {
            pr[j] -= global.ring[o][j + 1] - global.ring[n][j + 1];
        }
        global.ringselect[i] = n;
    }
    for (j = 0; j < global.prct; j++) {
        document.getElementById(global.prvn[j]).value = pr[j];
    }
    calc_lvlup();
}
function randtable(sp, indexs, indexl) {
    var i;
    var st;
    var ret = [];
    ret.push("No." + (sp + global.prim + 1) + "<br>");
    if (sp < 0 || sp > global.maxlen + 1) {
        for (i = 0; i < 24; i++) {
            ret.push(" --");
        }
        ret.push("<br>");
        for (i = 0; i < 24; i++) {
            ret.push(" --");
        }
        ret.push("<br>");
        for (i = 0; i < 7; i++) {
            ret.push(" --");
        }
        return ret.join("");
    }
    sp *= 55;
    for (i = 0; i < 24; i++) {
        st = String(global.vv[sp] + 99).slice(1);
        if (sp == indexs) {
            st = "<span class=trg>" + st + "</span>";
        } else if (sp == indexl) {
            st = "<span class=trg>" + st + "</span>";
        }
        if (ox(global.vv[sp])) {
            st = " <span class=maru>" + st + "</span>";
        } else {
            st = " <span class=batsu>" + st + "</span>";
        }
        ret.push(st);
        sp++;
    }
    ret.push("<br>");
    for (i = 0; i < 24; i++) {
        st = String(global.vv[sp] + 99).slice(1);
        if (sp == indexs) {
            st = "<span class=trg>" + st + "</span>";
        } else if (sp == indexl) {
            st = "<span class=trg>" + st + "</span>";
        }
        if (ox(global.vv[sp])) {
            st = " <span class=maru>" + st + "</span>";
        } else {
            st = " <span class=batsu>" + st + "</span>";
        }
        ret.push(st);
        sp++;
    }
    ret.push("<br>");
    for (i = 0; i < 7; i++) {
        st = String(global.vv[sp] + 99).slice(1);
        if (sp == indexs) {
            st = "<span class=trg>" + st + "</span>";
        } else if (sp == indexl) {
            st = "<span class=trg>" + st + "</span>";
        }
        if (ox(global.vv[sp])) {
            st = " <span class=maru>" + st + "</span>";
        } else {
            st = " <span class=batsu>" + st + "</span>";
        }
        ret.push(st);
        sp++;
    }
    return ret.join("");
}
function createTable(f) {
    //乱数表表示
    if (f == 1) {
        var ranvalue = [];
        var map = mapselected(0);
        var i;
        for (i = 0; i < global.maxlen * 55; i++) {
            ranvalue.push(String(global.vv[i] + 99).slice(1));
        }
        document.getElementById("randnum").innerHTML = "map:" + map + "<br>" + ranvalue.join(" ");
    } else if (f == 2) {
        var i;
        var ret = [];
        var indexs = parseInt(document.getElementById("view_val").value) - global.prim * 55;
        var indexl = lv_val_glance();
        var map = mapselected(0);
        for (i = 0; i <= global.maxlen; i++) {
            ret.push(randtable(i, indexs, indexl));
        }
        document.getElementById("randnum").innerHTML = "map:" + map + "<br>" + ret.join("<br>");
    } else {
        document.getElementById("randnum").innerHTML = "";
    }
}
function ch_all() {
    //一括変更
    if (document.getElementById("chall").selectedIndex) {
        for (var i = 0; i < global.prct; i++) {
            document.getElementById("ch" + global.prvn[i]).selectedIndex = document.getElementById("chall").selectedIndex - 1;
        }
        document.getElementById("chall").selectedIndex = 0;
        calc_lvlup();
    }
}
function calc_lvlup() {
    //レベルアップ
    if (document.getElementById("search_type").selectedIndex == 1) {
        document.getElementById("search_type").selectedIndex = 0;
    }
    if (document.getElementById("search_type").selectedIndex == 2) {
        calc_lvlup_lv(0);
    } else if (document.getElementById("search_type").selectedIndex == 3) {
        search_thread();
    } else {
        calc_lvlup_lv(1);
    }
    lvup(0, 0);
    lvup(1, 0);
}
function kouho_show(ret) {
    //候補表示
    var cnt = ret.length;
    if (cnt == 0) {
        document.getElementById("kouho").innerHTML = "見つかりませんでした";
    } else {
        if (cnt > global.lvupmax) {
            ret = ret.slice(0, global.lvupmax);
            ret.push("...");
        }
        document.getElementById("kouho").innerHTML = "候補数：" + cnt + "<br>" + ret.join(" ");
    }
}
function calc_lvlup_lv(all) {
    //レベルアップ候補
    var i, j, k, l;
    var sumc;
    var f;
    var ret = [];
    global.kouho_vv = [];
    global.kouho_vv2 = [];
    var minup = document.getElementById("growmin").selectedIndex;
    var maxup = document.getElementById("growmax").selectedIndex;
    var diff = [];
    var gr = [];
    var gh = [];
    j = 0;
    k = 0;
    for (i = 0; i < global.prct; i++) {
        gr[i] = parseInt(document.getElementById(global.prvn[i]).value);
        if (isNaN(gr[i]) || gr[i] < 0) {
            gr[i] = 0;
        }
        diff[i] = document.getElementById("ch" + global.prvn[i]).selectedIndex;
        j += diff[i] ? 0 : 1;
        k += diff[i] == 3 ? 1 : 0;
        gh[i] = Math.floor(Math.max(gr[i] - 1, 0) / 100);
        gr[i] = gr[i] ? ((gr[i] + 99) % 100) + 1 : 0;
    }
    diff[global.prct] = document.getElementById("chreact").selectedIndex;
    gr[global.prct] = parseInt(document.getElementById("react").value);
    if (isNaN(gr[global.prct])) {
        gr[global.prct] = 0;
    }
    if (j > maxup) {
        maxup = document.getElementById("growmax").selectedIndex = j;
    }
    if (k > global.prct - minup) {
        minup = document.getElementById("growmin").selectedIndex = global.prct - k;
    }
    if (minup > maxup) {
        document.getElementById("kouho").innerHTML = "条件が矛盾しています";
        return false;
    }
    l = all ? global.maxlen * 55 : global.battle_vv.length;
    for (k = 0; k < l; k++) {
        i = all ? k : global.battle_vv[k] - global.prim * 55 + global.battle_vv2[k];
        f = 0;
        sumc = 0;
        for (j = 0; j < global.prct; j++) {
            if (global.vv[i + j] <= gr[j]) {
                f += diff[j] == 3 ? 1 : 0;
                if (diff[j] != 4) {
                    sumc++;
                }
            } else {
                if (diff[j] == 1) {
                    if (gh[j]) {
                        sumc++;
                    } else {
                        f++;
                    }
                }
                f += diff[j] == 0 ? 1 : 0;
            }
            if (f) {
                break;
            }
        }
        if (!f && sumc >= minup && sumc <= maxup) {
            global.kouho_vv2[i] = (global.prct << 1) + 1;
        } else {
            global.kouho_vv2[i] = global.prct << 1;
        }
        if (global.vv[i + global.prct] <= gr[global.prct]) {
            if (diff[global.prct] == 2) {
                f++;
            }
        } else {
            if (diff[global.prct] == 0) {
                f++;
            }
        }
        if (!f && sumc >= minup && sumc <= maxup) {
            ret.push(all ? k + global.prim * 55 : global.battle_vv[k]);
        }
    }
    global.kouho_vv = ret;
    kouho_show(ret);
}
function kouho_updown(v) {
    //前後の候補
    v -= 0;
    var i;
    var nowval = parseInt(document.getElementById("lv_val").value);
    for (i = 0; i < global.kouho_vv.length; i++) {
        if (nowval <= global.kouho_vv[i]) {
            break;
        }
    }
    if (nowval < global.kouho_vv[i] && v > 0) {
        i--;
    }
    i += v;
    if (i < 0 && nowval > global.kouho_vv[0]) {
        document.getElementById("lv_val").value = global.kouho_vv[0];
    } else if (i >= global.kouho_vv.length && nowval < global.kouho_vv[global.kouho_vv.length - 1]) {
        document.getElementById("lv_val").value = global.kouho_vv[global.kouho_vv.length - 1];
    } else if (i < 0 || i >= global.kouho_vv.length) {
        return false;
    } else {
        document.getElementById("lv_val").value = global.kouho_vv[i];
    }
    lv_val_f();
}
function kouho_next(f) {
    //現在の次の候補
    var i;
    var nowval = parseInt(document.getElementById("view_val").value);
    for (i = 0; i < global.kouho_vv.length; i++) {
        if (nowval <= global.kouho_vv[i]) {
            break;
        }
    }
    if (i < 0 && nowval > global.kouho_vv[0]) {
        document.getElementById("lv_val").value = global.kouho_vv[0];
    } else if (i >= global.kouho_vv.length && nowval < global.kouho_vv[global.kouho_vv.length - 1]) {
        document.getElementById("lv_val").value = global.kouho_vv[global.kouho_vv.length - 1];
    } else if (i < 0 || i >= global.kouho_vv.length) {
        return false;
    } else {
        document.getElementById("lv_val").value = global.kouho_vv[i];
    }
    if (f) {
        lv_val_f();
    }
}
function all_show(flag) {
    //全て表示
    var ret = flag ? global.kouho_vv : global.search_vv;
    if (flag) {
        document.getElementById("kouho").innerHTML = "候補数：" + ret.length + "<br>" + ret.join(" ");
    } else {
        document.getElementById("search_m_ret").innerHTML = "候補数：" + ret.length + "<br>" + ret.join(" ");
    }
}
function search_mx_onchange() {
    //現在位置検索ボタン
    var lox = document.getElementById("search_ma").value;
    global.search_vv = [];
    if (lox.length < 4) {
        document.getElementById("search_m_ret").innerHTML = "４文字以上入力してください";
        document.getElementById("search_len").innerHTML = "-";
        return false;
    }
    search_m_onchange();
}
function search_m_onchange() {
    //現在位置検索
    var i, j, k;
    var cnt;
    var len;
    var pl = document.getElementById("inpl").checked ? 1 : 0;
    var seed = mapselected(0);
    var type = document.getElementById("search_dtb").checked;
    var lox = document.getElementById("search_ma").value;
    if (!lox) {
        document.getElementById("search_m_ret").innerHTML = "";
        document.getElementById("search_len").innerHTML = 0;
        return false;
    }
    var lox2 = [];
    len = lox.length;
    for (i = 0; i < lox.length; i++) {
        if (lox.charAt(i) == "o") {
            lox2.push(0);
        } else if (lox.charAt(i) == "c") {
            lox2.push(0);
        } else if (lox.charAt(i) == "○") {
            lox2.push(0);
        } else if (lox.charAt(i) == "x") {
            lox2.push(1);
        } else if (lox.charAt(i) == "×") {
            lox2.push(1);
        }
    }
    len = lox2.length;
    document.getElementById("search_len").innerHTML = len;
    if (!len) {
        document.getElementById("search_m_ret").innerHTML = "oかxを入力してください";
        return false;
    }
    if (type) {
        var ret = [];
        global.search_vv = [];
        cnt = 0;
        for (i = 1; i < global.maxlen * 55; i++) {
            for (j = 0; j < len; j++) {
                if (lox2[j] == 0) {
                    if (ox(global.vv[i + j])) continue;
                } else {
                    if (!ox(global.vv[i + j])) continue;
                }
                break;
            }
            if (j == len) {
                ret.push(i + global.prim * 55 + pl * len);
                cnt++;
            }
        }
        global.search_vv = ret;
        if (cnt == 0) {
            type = 0;
        } else {
            if (cnt > global.srchmax) {
                ret = ret.slice(0, global.srchmax);
                ret.push("...");
            }
            document.getElementById("search_m_ret").innerHTML = "候補数：" + cnt + "<br>" + ret.join(" ");
        }
    }
    if (!type) {
        var ret = [];
        global.search_vv = [];
        cnt = 0;
        for (k = 0; k < global.randmap; k++) {
            ret[k] = [];
            for (i = 1; i < 2; i++) {
                for (j = 0; j < len; j++) {
                    if (i + j >= 55) {
                        break;
                    }
                    if (lox2[j] == 0) {
                        if (ox(global.msp[k][i + j])) continue;
                    } else {
                        if (!ox(global.msp[k][i + j])) continue;
                    }
                    break;
                }
                if (j == len) {
                    cnt++;
                    ret[k].push(i + pl * len);
                }
            }
            if (k == seed) {
                global.search_vv = ret[k];
            }
            if (ret[k].length > global.scalmax) {
                ret[k] = ret[k].slice(0, global.scalmax);
                ret[k].push("...");
            }
        }
        if (cnt == 0) {
            document.getElementById("search_m_ret").innerHTML = "ありません";
        } else {
            document.getElementById("search_m_ret").innerHTML = "候補数：" + cnt + " map" + seed + "：" + global.search_vv.length;
            for (i = 0; i < global.randmap; i++) {
                if (ret[i].length) {
                    document.getElementById("search_m_ret").innerHTML +=
                        '<br><span onclick="change_map(1,' + i + ')" class="chmap">' + i + ":" + ret[i].join(" ") + "</span>";
                }
            }
        }
    }
}
function ox(r) {
    return global.svv_tora[(r %= 25)];
}
function search_updown(v) {
    //次の位置
    v = parseInt(v);
    var i;
    var nowval = parseInt(document.getElementById("view_val").value);
    for (i = 0; i < global.search_vv.length; i++) {
        if (nowval <= global.search_vv[i]) {
            break;
        }
    }
    if (nowval < global.search_vv[i] && v > 0) {
        i--;
    }
    i += v;
    if (i < 0 && nowval > global.search_vv[0]) {
        document.getElementById("view_val").value = global.search_vv[0];
    } else if (i >= global.search_vv.length && nowval < global.search_vv[global.search_vv.length - 1]) {
        document.getElementById("view_val").value = global.search_vv[global.search_vv.length - 1];
    } else if (i < 0 || i >= global.search_vv.length) {
        return false;
    } else {
        document.getElementById("view_val").value = global.search_vv[i];
    }
    view_val_f();
}
function search_thread() {
    var i, j;
    var min, max;
    var l_type;
    var lvf = 0;
    var rvv = [];
    var rec = [];
    var t_rec = [];
    var renstr = [];
    var sv = [];
    var rstr = document.getElementById("search_mc").value;
    if (!rstr.length) {
        document.getElementById("kouho").innerHTML = "";
        return;
    }
    rstr = rstr.replace(/\r\n/g, "\n");
    rvv = rstr.split("\n");
    for (i = 0; i < rvv.length; i++) {
        sv[i] = [];
        if (!rvv[i].length) {
            continue;
        }
        t_rec = rvv[i].replace(/\/\/.*/, "");
        t_rec = t_rec.replace(/[ 　\t]+/g, "");
        if (t_rec.match(/lvup/i)) {
            sv[i].push(2, 0, 0);
            if (!lvf) {
                if (i) {
                    document.getElementById("plkae").checked = 0;
                    document.getElementById("pls").value = i;
                }
                lvf = 1;
            }
        } else {
            rec = t_rec.split("|");
            for (j = 0; j < rec.length; j++) {
                if (rec[j] == "o" || rec[j] == "c" || rec[j] == "○") {
                    l_type = 3;
                    min = 0;
                    max = 0;
                } else if (rec[j] == "x" || rec[j] == "×") {
                    l_type = 3;
                    min = 1;
                    max = 0;
                } else {
                    if (rec[j].match(/:/)) {
                        t_rec = rec[j].split(":");
                        l_type = 1;
                        renstr = t_rec[1];
                    } else {
                        l_type = 0;
                        renstr = rec[j];
                    }
                    if (!renstr.length) {
                        continue;
                    }
                    if (renstr.match("-")) {
                        t_rec = renstr.split("-");
                        min = parseInt(t_rec[0].length == 0 ? 0 : t_rec[0]);
                        max = parseInt(t_rec[1].length == 0 ? 99 : t_rec[1]);
                    } else {
                        min = parseInt(renstr);
                        max = parseInt(renstr);
                    }
                    if (isNaN(min) || isNaN(max)) {
                        if (confirm(i + 1 + "行目の式の評価に失敗しました\n" + rvv[i] + "\nOK:無視 キャンセル:中断")) {
                            if (isNaN(min)) {
                                min = 0;
                            }
                            if (isNaN(max)) {
                                max = 99;
                            }
                        } else {
                            document.getElementById("kouho").innerHTML = i + 1 + "行目の式の評価に失敗しました";
                            return;
                        }
                    }
                    min++;
                    max++;
                }
                sv[i].push(l_type, min, max);
            }
        }
    }
    do_search_thread(sv);
    document.getElementById("search_type").selectedIndex = 3;
    kouho_show(global.kouho_vv);
}
function do_search_thread(sv) {
    var i, j, k;
    var p;
    var matchflag;
    calc_lvlup_lv(1);
    global.kouho_vv = [];
    for (i = 0; i < global.maxlen * 55; i++) {
        p = 0;
        for (j = 0; j < sv.length; j++) {
            matchflag = 0;
            for (k = 0; k * 3 < sv[j].length; k++) {
                if (sv[j][k * 3] == 3) {
                    //ox
                    if (ox(global.vv[i + j + p]) ^ sv[j][k * 3 + 1]) {
                        matchflag = 1;
                    }
                } else if (sv[j][k * 3] == 2) {
                    //Lv
                    if (global.kouho_vv2[i + j] & 1) {
                        matchflag = 1;
                    }
                    p += (global.kouho_vv2[i + j] >> 1) - 1;
                } else if (sv[j][k * 3] == 1) {
                    //平均
                    if (
                        (global.vv[i + j + p] + global.vv[i + j + p + 1]) >> 1 >= sv[j][k * 3 + 1] &&
                        (global.vv[i + j + p] + global.vv[i + j + p + 1]) >> 1 <= sv[j][k * 3 + 2]
                    ) {
                        matchflag = 1;
                    }
                } else {
                    //範囲
                    if (global.vv[i + j + p] >= sv[j][k * 3 + 1] && global.vv[i + j + p] <= sv[j][k * 3 + 2]) {
                        matchflag = 1;
                    }
                }
                if (matchflag) {
                    break;
                }
            }
            if (!sv[j].length) {
                matchflag = 1;
            }
            if (!matchflag) {
                break;
            }
        }
        if (matchflag) {
            global.kouho_vv.push(i + global.prim * 55);
        }
    }
}
function thread_lvup() {
    var str = document.getElementById("search_mc").value;
    if (str.length && str.slice(str.length - 1) != "\n") {
        document.getElementById("search_mc").value += "\n";
    }
    document.getElementById("search_mc").value += "lvup()";
    /*
var ret=[];
var diff=[];
var gr=[];
for(var i=0;i<prct;i++){
gr[i]=parseInt(document.getElementById(prvn[i]).value);
if(isNaN(gr[i])||gr[i]<0){ gr[i]=0; }
diff[i]=document.getElementById("ch"+prvn[i]).selectedIndex;
if(gr[i]%100==0){
ret.push("0-99"+" //"+para[i]);
}else if(diff[i]==0){
ret.push("0-"+(gr[i]%100-1)+" //"+para[i]);
}else if(diff[i]==1){
ret.push("0-"+Math.min(gr[i]-1,99)+" //"+para[i]);
}else if(diff[i]==2||diff[i]==4){
ret.push("0-99"+" //"+para[i]);
}
else if(diff[i]==3){
ret.push((gr[i]%100)+"-99"+" //"+para[i]);
}
}
var str=document.getElementById("search_mc").value;
if(str.length&&str.slice(str.length-1)!="\n"){ document.getElementById("search_mc").value+="\n" }
document.getElementById("search_mc").value+=ret.join("\n");
*/
}
function addt(i, v) {
    return "<span title='" + addw(i - 1, v) + "' class=ttl>" + v + "</span>";
}
function battle_kougeki(ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) {
    var gekko = 0;
    var taiyo = 0;
    var otate = 0;
    var hissatsu = 0;
    var meichu = 0;
    var noroi = 0;
    var kodt = [2, 1, 1, 4, 3, 3][type];
    // ["怒り","祈り","大盾","待伏","月光","太陽","流星","連続","勇者","突撃","無敵","吸収","呪い","眠り"]
    // ["   2","   3","   4","   5","   6","   7","   8","   9","  10","  11","  12","  13","  14","  15"]
    if (sklsws[ater][kodt] != "") {
        sklsws[ater][kodt] += " ";
    }
    if (skill[ater][6] && para[ater][6]) {
        //月光剣
        if (para[ater][6] >= global.vv[index++]) {
            gekko = 1;
            sklsws[ater][kodt] += addt(index, "月O");
        } else {
            sklsws[ater][kodt] += addt(index, "月X");
        }
    }
    if (skill[ater][7] && para[ater][6]) {
        //太陽剣
        if (para[ater][6] >= global.vv[index++]) {
            if (!skill[ater][14]) {
                taiyo = 1;
                sklsws[ater][kodt] += addt(index, "太O");
            } else {
                sklsws[ater][kodt] += addt(index, "太D");
            }
        } else {
            sklsws[ater][kodt] += addt(index, "太X");
        }
    }
    if (skill[1 - ater][4]) {
        //大盾
        if (para[1 - ater][5] + 1 >= global.vv[index++]) {
            if (!gekko && !taiyo) {
                otate = 1;
                sklsws[ater][kodt] += addt(index, "盾O");
            } else {
                sklsws[ater][kodt] += addt(index, "盾D");
            }
        } else {
            sklsws[ater][kodt] += addt(index, "盾X");
        }
    }
    var jcrt;
    if (type % 3) {
        jcrt = Math.min(25, para[ater][3]);
        if (type % 3 == 2 && skill[ater][2]) {
            jcrt = 100;
        }
    } else {
        jcrt = para[ater][3] * para[ater][4];
    }
    if (jcrt >= global.vv[index++]) {
        hissatsu = 1;
        sklsws[ater][kodt] += addt(index, "必O");
    } else {
        sklsws[ater][kodt] += addt(index, "必X");
    }
    index++; //謎消費
    if (otate) {
        hitcnt[ater][2]++;
    } else {
        if (gekko || taiyo) {
            meichu = 1;
        } else {
            if (para[ater][2] >= global.vv[index++]) {
                meichu = 1;
                sklsws[ater][kodt] += addt(index, "命O");
            } else {
                sklsws[ater][kodt] += addt(index, "命X");
            }
        }
        var dmg = Math.max(0, para[ater][0] * (1 + hissatsu) - para[1 - ater][1] * (1 - gekko));
        if (dmg >= hp[1 - ater] && skill[1 - ater][12]) {
            meichu = 0;
            sklsws[ater][kodt] += "祈";
        }
        if (meichu) {
            if (skill[ater][14]) {
                //デビルアクス
                if (21 - para[ater][8] >= global.vv[index++]) {
                    noroi = 1;
                    sklsws[ater][kodt] += addt(index, "呪O");
                } else {
                    sklsws[ater][kodt] += addt(index, "呪X");
                }
            }
            if (noroi) {
                hitcnt[ater][3] += dmg;
                dmg = Math.min(hp[ater], dmg);
                hp[ater] -= dmg;
            } else {
                hitcnt[1 - ater][3] += dmg;
                dmg = Math.min(hp[1 - ater], dmg);
                hp[1 - ater] -= dmg;
            }
            if (taiyo || skill[ater][13]) {
                hp[ater] += dmg;
                hitcnt[ater][4] += dmg;
            }
            if (skill[ater][15]) {
                sklsws[ater][kodt] += "眠";
                hitcnt[2] = 1;
                hitcnt[ater][5] = 1;
            }
            if (skill[ater][16]) {
                sklsws[ater][kodt] += "毒";
                hitcnt[ater][5] = 1;
            }
            hitcnt[ater][0]++;
        } else {
            hitcnt[ater][1]++;
        }
    }
    hp[ater] = Math.min(hp[ater], hp[ater + 2]);
    if (!hp[0] || !hp[1]) {
        hitcnt[2] = 1;
    }
    return index;
}
function battle_koudou(ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) {
    var ct = 1;
    if (skill[ater][8] && para[ater][6]) {
        //流星剣
        if (para[ater][6] >= global.vv[index++]) {
            ct *= 5;
            sklsws[ater][0] += addt(index, "流O");
        } else {
            sklsws[ater][0] += addt(index, "流X");
        }
    }
    if (ct == 1) {
        if (skill[ater][9] && para[ater][7]) {
            //連続
            if (para[ater][7] >= global.vv[index++]) {
                ct *= 2;
                sklsws[ater][0] += addt(index, "連O");
            } else {
                sklsws[ater][0] += addt(index, "連X");
            }
        }
    }
    if (skill[ater][10]) {
        ct *= 2;
    }
    for (var i = 0; i < ct; i++) {
        atju.push(ater);
        attp.push(type);
    }
    return index;
}
function battle2(hp, hitcnt, sklsws, para, skill, index) {
    var i;
    var atju = [];
    var attp = [];
    if (!skill[0][12] && skill[0][3] && para[0][8]) {
        if (para[0][8] * 3 >= global.vv[index++]) {
            skill[0][12] = 1;
            sklsws[0][0] += addt(index, "祈O");
        } else {
            sklsws[0][0] += addt(index, "祈X");
        }
    }
    if (!skill[1][12] && skill[1][3] && para[1][8]) {
        if (para[1][8] * 3 >= global.vv[index++]) {
            skill[1][12] = 1;
            sklsws[1][0] += addt(index, "祈O");
        } else {
            sklsws[1][0] += addt(index, "祈X");
        }
    }
    if (skill[1][0] && skill[1][5]) {
        //待ち伏せ
        index = battle_koudou(1, 1, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        index = battle_koudou(0, 2, hp, hitcnt, sklsws, para, skill, atju, attp, index);
    } else {
        index = battle_koudou(0, 1, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        if (skill[1][0]) {
            index = battle_koudou(1, 2, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        }
    }
    if (skill[0][1]) {
        index = battle_koudou(0, 0, hp, hitcnt, sklsws, para, skill, atju, attp, index);
    }
    if (skill[1][1]) {
        index = battle_koudou(1, 0, hp, hitcnt, sklsws, para, skill, atju, attp, index);
    }
    if (skill[0][11] || skill[1][11]) {
        //突撃
        if (skill[1][0] && skill[1][5]) {
            index = battle_koudou(1, 4, hp, hitcnt, sklsws, para, skill, atju, attp, index);
            index = battle_koudou(0, 5, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        } else {
            index = battle_koudou(0, 4, hp, hitcnt, sklsws, para, skill, atju, attp, index);
            if (skill[1][0]) {
                index = battle_koudou(1, 5, hp, hitcnt, sklsws, para, skill, atju, attp, index);
            }
        }
        if (skill[0][1]) {
            index = battle_koudou(0, 3, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        }
        if (skill[1][1]) {
            index = battle_koudou(1, 3, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        }
    }
    while (atju.length) {
        index = battle_kougeki(atju[0], attp[0], hp, hitcnt, sklsws, para, skill, atju, attp, index);
        atju.shift();
        attp.shift();
        if (hitcnt[2]) {
            break;
        }
    }
    return index;
}
function battle() {
    var hp = [
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
        document.getElementById("atmhp").selectedIndex + 1,
        document.getElementById("dfmhp").selectedIndex + 1,
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
    ];
    var para = [];
    para[0] = [
        document.getElementById("atatc").selectedIndex,
        document.getElementById("atdef").selectedIndex,
        document.getElementById("athit").selectedIndex,
        document.getElementById("atcrt").selectedIndex,
        document.getElementById("atcrtkei").selectedIndex,
        document.getElementById("atlvl").selectedIndex,
        document.getElementById("atskl").selectedIndex,
        document.getElementById("atspd").selectedIndex,
        document.getElementById("atluck").selectedIndex,
    ];
    para[1] = [
        document.getElementById("dfatc").selectedIndex,
        document.getElementById("dfdef").selectedIndex,
        document.getElementById("dfhit").selectedIndex,
        document.getElementById("dfcrt").selectedIndex,
        document.getElementById("dfcrtkei").selectedIndex,
        document.getElementById("dflvl").selectedIndex,
        document.getElementById("dfskl").selectedIndex,
        document.getElementById("dfspd").selectedIndex,
        document.getElementById("dfluck").selectedIndex,
    ];
    var skill = [];
    skill[0] = [1, document.getElementById("attsuigeki").checked];
    skill[1] = [document.getElementById("hangeki").checked, document.getElementById("dftsuigeki").checked];
    for (i = 0; i < global.skilln; i++) {
        skill[0][i + 2] = document.getElementById("atskill" + i).checked;
        skill[1][i + 2] = document.getElementById("dfskill" + i).checked;
    }
    var m = [skill[0][12], skill[1][12]];
    var hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    var sklsws = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ];
    var index = lv_val_glance();
    var index_p = index;
    if (document.getElementById("sakiyomi").checked) {
        index = battle2(hp, hitcnt, sklsws, para, skill, index);
    }
    hp[0] = hp[4];
    hp[1] = hp[5];
    hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    sklsws = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ];
    skill[0][12] = m[0];
    skill[1][12] = m[1];
    index = battle2(hp, hitcnt, sklsws, para, skill, index);
    document.getElementById("at0").innerHTML = sklsws[0][0] || "-";
    document.getElementById("at1").innerHTML = sklsws[0][1] || "-";
    document.getElementById("at2").innerHTML = sklsws[0][2] || "-";
    document.getElementById("at3").innerHTML = sklsws[0][3] || "-";
    document.getElementById("at4").innerHTML = sklsws[0][4] || "-";
    document.getElementById("df0").innerHTML = sklsws[1][0] || "-";
    document.getElementById("df1").innerHTML = sklsws[1][1] || "-";
    document.getElementById("df2").innerHTML = sklsws[1][2] || "-";
    document.getElementById("df3").innerHTML = sklsws[1][3] || "-";
    document.getElementById("df4").innerHTML = sklsws[1][4] || "-";
    document.getElementById("att").innerHTML =
        hitcnt[0][0] + "h " + hitcnt[0][1] + "m " + hitcnt[0][2] + "s " + hitcnt[0][3] + "d " + hitcnt[0][4] + "a";
    document.getElementById("dft").innerHTML =
        hitcnt[1][0] + "h " + hitcnt[1][1] + "m " + hitcnt[1][2] + "s " + hitcnt[1][3] + "d " + hitcnt[1][4] + "a";
    document.getElementById("atahp").innerHTML = hp[0] + "hp";
    document.getElementById("dfahp").innerHTML = hp[1] + "hp";
    document.getElementById("usrd").innerHTML = "使用乱数<br>" + (index - index_p) + "個";
    if (document.getElementById("plkae").checked) {
        document.getElementById("pls").value = index - index_p;
    }
    yosoku();
    lvup(1, 0);
}
function battle_s() {
    document.getElementById("bt_kouho").innerHTML = "未検索";
    battle();
}
function battle_ss(f) {
    if (f == 0 && document.getElementById("attsuigeki").checked) {
        document.getElementById("dftsuigeki").checked = 0;
    } else if (f == 1 && !document.getElementById("hangeki").checked) {
        document.getElementById("dftsuigeki").checked = 0;
    } else if (f == 2 && document.getElementById("dftsuigeki").checked) {
        document.getElementById("attsuigeki").checked = 0;
        document.getElementById("hangeki").checked = 1;
    }
    battle_s();
}
function battle_search_kougeki(ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) {
    var gekko = 0;
    var taiyo = 0;
    var otate = 0;
    var hissatsu = 0;
    var meichu = 0;
    var noroi = 0;
    var kodt = [2, 1, 1, 4, 3, 3][type];
    // ["怒り","祈り","大盾","待伏","月光","太陽","流星","連続","勇者","突撃","無敵","吸収","呪い","眠り"]
    // ["   2","   3","   4","   5","   6","   7","   8","   9","  10","  11","  12","  13","  14","  15"]
    if (skill[ater][6] && para[ater][6]) {
        //月光剣
        if (para[ater][6] >= global.vv[index++]) {
            gekko = 1;
        }
    }
    if (skill[ater][7] && para[ater][6]) {
        //太陽剣
        if (para[ater][6] >= global.vv[index++]) {
            if (!skill[ater][14]) {
                taiyo = 1;
            }
        }
    }
    if (skill[1 - ater][4]) {
        //大盾
        if (para[1 - ater][5] + 1 >= global.vv[index++]) {
            if (!gekko && !taiyo) {
                otate = 1;
            }
        }
    }
    var jcrt;
    if (type % 3) {
        jcrt = Math.min(25, para[ater][3]);
        if (type % 3 == 2 && skill[ater][2]) {
            jcrt = 100;
        }
    } else {
        jcrt = para[ater][3] * para[ater][4];
    }
    if (jcrt >= global.vv[index++]) {
        hissatsu = 1;
    }
    index++; //謎消費
    if (otate) {
        hitcnt[ater][2]++;
    } else {
        if (gekko || taiyo) {
            meichu = 1;
        } else {
            if (para[ater][2] >= global.vv[index++]) {
                meichu = 1;
            }
        }
        var dmg = Math.max(0, para[ater][0] * (1 + hissatsu) - para[1 - ater][1] * (1 - gekko));
        if (dmg >= hp[1 - ater] && skill[1 - ater][12]) {
            meichu = 0;
        }
        if (meichu) {
            if (skill[ater][14]) {
                //デビルアクス
                if (21 - para[ater][8] >= global.vv[index++]) {
                    noroi = 1;
                }
            }
            if (noroi) {
                hitcnt[ater][3] += dmg;
                dmg = Math.min(hp[ater], dmg);
                hp[ater] -= dmg;
            } else {
                hitcnt[1 - ater][3] += dmg;
                dmg = Math.min(hp[1 - ater], dmg);
                hp[1 - ater] -= dmg;
            }
            if (taiyo || skill[ater][13]) {
                hp[ater] += dmg;
                hitcnt[ater][4] += dmg;
            }
            if (skill[ater][15]) {
                hitcnt[2] = 1;
                hitcnt[ater][5] = 1;
            }
            if (skill[ater][16]) {
                hitcnt[ater][5] = 1;
            }
            hitcnt[ater][0]++;
        } else {
            hitcnt[ater][1]++;
        }
    }
    hp[ater] = Math.min(hp[ater], hp[ater + 2]);
    if (!hp[0] || !hp[1]) {
        hitcnt[2] = 1;
    }
    return index;
}
function battle_search_koudou(ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) {
    var ct = 1;
    if (skill[ater][8] && para[ater][6]) {
        //流星剣
        if (para[ater][6] >= global.vv[index++]) {
            ct *= 5;
        }
    }
    if (ct == 1) {
        if (skill[ater][9] && para[ater][7]) {
            //連続
            if (para[ater][7] >= global.vv[index++]) {
                ct *= 2;
            }
        }
    }
    if (skill[ater][10]) {
        ct *= 2;
    }
    for (var i = 0; i < ct; i++) {
        atju.push(ater);
        attp.push(type);
    }
    return index;
}
function battle_search2(hp, hitcnt, sklsws, para, skill, index) {
    var i;
    var atju = [];
    var attp = [];
    if (!skill[0][12] && skill[0][3] && para[0][8]) {
        if (para[0][8] * 3 >= global.vv[index++]) {
            skill[0][12] = 1;
        }
    }
    if (!skill[1][12] && skill[1][3] && para[1][8]) {
        if (para[1][8] * 3 >= global.vv[index++]) {
            skill[1][12] = 1;
        }
    }
    if (skill[1][0] && skill[1][5]) {
        //待ち伏せ
        index = battle_search_koudou(1, 1, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        index = battle_search_koudou(0, 2, hp, hitcnt, sklsws, para, skill, atju, attp, index);
    } else {
        index = battle_search_koudou(0, 1, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        if (skill[1][0]) {
            index = battle_search_koudou(1, 2, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        }
    }
    if (skill[0][1]) {
        index = battle_search_koudou(0, 0, hp, hitcnt, sklsws, para, skill, atju, attp, index);
    }
    if (skill[1][1]) {
        index = battle_search_koudou(1, 0, hp, hitcnt, sklsws, para, skill, atju, attp, index);
    }
    if (skill[0][11] || skill[1][11]) {
        //突撃
        if (skill[1][0] && skill[1][5]) {
            index = battle_search_koudou(1, 4, hp, hitcnt, sklsws, para, skill, atju, attp, index);
            index = battle_search_koudou(0, 5, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        } else {
            index = battle_search_koudou(0, 4, hp, hitcnt, sklsws, para, skill, atju, attp, index);
            if (skill[1][0]) {
                index = battle_search_koudou(1, 5, hp, hitcnt, sklsws, para, skill, atju, attp, index);
            }
        }
        if (skill[0][1]) {
            index = battle_search_koudou(0, 3, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        }
        if (skill[1][1]) {
            index = battle_search_koudou(1, 3, hp, hitcnt, sklsws, para, skill, atju, attp, index);
        }
    }
    while (atju.length) {
        index = battle_search_kougeki(atju[0], attp[0], hp, hitcnt, sklsws, para, skill, atju, attp, index);
        atju.shift();
        attp.shift();
        if (hitcnt[2]) {
            break;
        }
    }
    return index;
}
function battle_search1() {
    var i;
    global.battle_vv = [];
    global.battle_vv2 = [];
    var hp = [
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
        document.getElementById("atmhp").selectedIndex + 1,
        document.getElementById("dfmhp").selectedIndex + 1,
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
        document.getElementById("athpmin").selectedIndex,
        document.getElementById("dfhpmin").selectedIndex,
        document.getElementById("athpmax").selectedIndex,
        document.getElementById("dfhpmax").selectedIndex,
        document.getElementById("athitf").checked ? 0 : 1,
        document.getElementById("dfhitf").checked ? 0 : 1,
    ];
    var para = [];
    para[0] = [
        document.getElementById("atatc").selectedIndex,
        document.getElementById("atdef").selectedIndex,
        document.getElementById("athit").selectedIndex,
        document.getElementById("atcrt").selectedIndex,
        document.getElementById("atcrtkei").selectedIndex,
        document.getElementById("atlvl").selectedIndex,
        document.getElementById("atskl").selectedIndex,
        document.getElementById("atspd").selectedIndex,
        document.getElementById("atluck").selectedIndex,
    ];
    para[1] = [
        document.getElementById("dfatc").selectedIndex,
        document.getElementById("dfdef").selectedIndex,
        document.getElementById("dfhit").selectedIndex,
        document.getElementById("dfcrt").selectedIndex,
        document.getElementById("dfcrtkei").selectedIndex,
        document.getElementById("dflvl").selectedIndex,
        document.getElementById("dfskl").selectedIndex,
        document.getElementById("dfspd").selectedIndex,
        document.getElementById("dfluck").selectedIndex,
    ];
    var hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    var sklsws = [];
    var skill = [];
    skill[0] = [1, document.getElementById("attsuigeki").checked];
    skill[1] = [document.getElementById("hangeki").checked, document.getElementById("dftsuigeki").checked];
    for (i = 0; i < global.skilln; i++) {
        skill[0][i + 2] = document.getElementById("atskill" + i).checked;
        skill[1][i + 2] = document.getElementById("dfskill" + i).checked;
    }
    var m = [skill[0][12], skill[1][12]];
    for (i = 1; i < global.maxlen * 55; i++) {
        index = i;
        hp[0] = hp[4];
        hp[1] = hp[5];
        hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
        skill[0][12] = m[0];
        skill[1][12] = m[1];
        if (document.getElementById("sakiyomi").checked) {
            index = battle_search2(hp, hitcnt, sklsws, para, skill, index);
        }
        hp[0] = hp[4];
        hp[1] = hp[5];
        hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
        skill[0][12] = m[0];
        skill[1][12] = m[1];
        index = battle_search2(hp, hitcnt, sklsws, para, skill, index);

        if (
            hp[0] >= hp[6] &&
            hp[1] >= hp[7] &&
            hp[0] <= hp[8] &&
            hp[1] <= hp[9] &&
            hp[10] | hitcnt[0][5] &&
            hp[11] | hitcnt[1][5]
        ) {
            global.battle_vv.push(i + global.prim * 55);
            global.battle_vv2.push(index - i);
        }
    }
    document.getElementById("bt_kouho").innerHTML = "候補数：" + global.battle_vv.length;
    if (document.getElementById("search_type").selectedIndex != 2) {
        document.getElementById("search_type").selectedIndex = 1;
    }
    document.getElementById("plkae").checked = 1;
    Change_type();
}
function battle_search() {
    document.getElementById("bt_kouho").innerHTML = "検索中です…";
    window.setTimeout("battle_search1()", 1);
}
function yosoku() {
    var start = parseInt(document.getElementById("view_val").value) - global.prim * 55;
    var last = lv_val_glance();
    if (start > last) {
        document.getElementById("yosokukai").innerHTML = "----";
        return 0;
    }
    var hp = [
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
        document.getElementById("atmhp").selectedIndex + 1,
        document.getElementById("dfmhp").selectedIndex + 1,
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
        document.getElementById("athpmin").selectedIndex,
        document.getElementById("dfhpmin").selectedIndex,
        document.getElementById("athpmax").selectedIndex,
        document.getElementById("dfhpmax").selectedIndex,
        document.getElementById("athitf").checked ? 0 : 1,
        document.getElementById("dfhitf").checked ? 0 : 1,
    ];
    var para = [];
    para[0] = [
        document.getElementById("atatc").selectedIndex,
        document.getElementById("atdef").selectedIndex,
        document.getElementById("athit").selectedIndex,
        document.getElementById("atcrt").selectedIndex,
        document.getElementById("atcrtkei").selectedIndex,
        document.getElementById("atlvl").selectedIndex,
        document.getElementById("atskl").selectedIndex,
        document.getElementById("atspd").selectedIndex,
        document.getElementById("atluck").selectedIndex,
    ];
    para[1] = [
        document.getElementById("dfatc").selectedIndex,
        document.getElementById("dfdef").selectedIndex,
        document.getElementById("dfhit").selectedIndex,
        document.getElementById("dfcrt").selectedIndex,
        document.getElementById("dfcrtkei").selectedIndex,
        document.getElementById("dflvl").selectedIndex,
        document.getElementById("dfskl").selectedIndex,
        document.getElementById("dfspd").selectedIndex,
        document.getElementById("dfluck").selectedIndex,
    ];
    var hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    var sklsws = [];
    var skill = [];
    skill[0] = [1, document.getElementById("attsuigeki").checked];
    skill[1] = [document.getElementById("hangeki").checked, document.getElementById("dftsuigeki").checked];
    for (i = 0; i < global.skilln; i++) {
        skill[0][i + 2] = document.getElementById("atskill" + i).checked;
        skill[1][i + 2] = document.getElementById("dfskill" + i).checked;
    }
    var m = [skill[0][12], skill[1][12]];
    var index = start;
    var index2 = index;
    var cnt = -1;
    while (index <= last) {
        index2 = index;
        cnt++;
        hp[0] = hp[4];
        hp[1] = hp[5];
        hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
        skill[0][12] = m[0];
        skill[1][12] = m[1];
        index = battle_search2(hp, hitcnt, sklsws, para, skill, index);
    }
    document.getElementById("yosokukai").innerHTML =
        start +
        global.prim * 55 +
        "→" +
        (last + global.prim * 55) +
        "：" +
        cnt +
        "回+" +
        (last - index2) +
        (cnt
            ? " (約" + Math.floor(((cnt - 1) * 3) / 20) + "." + ((Math.floor((cnt - 1) * 15) % 100) + 100 + "秒)").slice(1)
            : "");
}
function displaystyle(hlay, blay) {
    if (document.getElementById(hlay).style.display) {
        document.getElementById(hlay).style.display = "";
        if (blay) {
            document.getElementById(blay).value = "非表示";
        }
    } else {
        document.getElementById(hlay).style.display = "none";
        if (blay) {
            document.getElementById(blay).value = "表示";
        }
    }
}
