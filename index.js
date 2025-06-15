/// @ts-check
"use strict";

import { msp, pika, pika2, rasu, ring, skillList, svv_tora, ud } from "./constant.js";

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
global.msp = msp;
global.randmap = global.msp.length; //乱数マップの数

global.rasu = rasu;
global.pika = pika;
global.pika2 = pika2;

global.svv_tora = svv_tora;
//成長率
global.ud = ud;
global.ring = ring;
global.unitindex = 1; //初期選択ユニット
global.skilllist = skillList; //スキル
global.skilln = global.skilllist.length;

const rand_calc = (data) => {
    //乱数計算
    for (let i = 54; i >= 0; i--) {
        data[(i + 24) % 55] = ((99 + data[(i + 24) % 55] - data[i]) % 100) + 1;
    }
    for (let i = 0; i < 7; i++) {
        data[i + 48] = ((data[i + 48] + data[i] - 1) % 100) + 1;
    }
};
const rand_ins = (data) => {
    //乱数を配列に入れる
    global.vv = [];
    global.vv = global.vv.concat(data);
    for (let i = 0; i <= global.maxlen; i++) {
        rand_calc(data);
        global.vv = global.vv.concat(data);
    }
};

const next = () => {
    //次の乱数
    let nn = parseInt(document.getElementById("rand_max").value);
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
};

const reset = () => {
    //再設定
    document.getElementById("rand_start").value = global.prim;
    document.getElementById("rand_max").value = global.maxlen;
    document.getElementById("view_val").value = 0;
    change_map(0, 0);
    kouho_next(1);
};
const change_max = () => {
    //乱数の個数変更
    const npInput = parseInt(document.getElementById("rand_start").value);
    const nnInput = parseInt(document.getElementById("rand_max").value);
    const np = isNaN(npInput) ? global.prim : Math.max(0, npInput);
    const nn = isNaN(nnInput) ? global.maxlen : Math.max(0, nnInput);

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
};
const mapselected = (f) => {
    if (f ^ document.getElementById("pikacheck").checked) {
        return global.pika[document.getElementById("seed").selectedIndex];
    } else {
        return document.getElementById("seed").selectedIndex;
    }
};
const mapselect = (m) => {
    if (document.getElementById("pikacheck").checked) {
        document.getElementById("seed").selectedIndex = global.pika2[m];
    } else {
        document.getElementById("seed").selectedIndex = m;
    }
};
const pikasort = (f) => {
    const ret = [];
    const map = f ? mapselected(1) : 30;
    const isPika = document.getElementById("pikacheck").checked;
    for (let i = 0; i < global.randmap; i++) {
        ret.push("<option>" + (isPika ? global.pika[i] : i) + "</option>");
    }
    // Remove old select if exists
    const mapContainer = document.getElementById("map");
    while (mapContainer.firstChild) mapContainer.removeChild(mapContainer.firstChild);

    const select = document.createElement("select");
    select.id = "seed";
    select.onchange = function () {
        change_map(0, 0);
    };
    for (let i = 0; i < ret.length; i++) {
        const option = document.createElement("option");
        option.innerHTML = ret[i].replace(/<\/?option>/g, "");
        select.appendChild(option);
    }
    mapContainer.appendChild(select);
    mapselect(map);
};
const map_swap = () => {
    if (global.vv_bn < 0) {
        1;
    } else {
        mapselect(global.vv_bn);
        change_map(0, 0);
    }
};
const change_map = (f, m) => {
    if (f) {
        document.getElementById("search_dtb").checked = 1;
        mapselect(m);
        document.getElementById("view_val").value = 0;
        document.getElementById("lv_val").value = 0;
    }
    const map = mapselected(0);
    if (global.vv_n == map) {
        1;
    } else if (global.vv_bn == map) {
        const buf = global.vv;
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
        const data = [];
        data.push(...global.msp[map]);
        for (let i = 0; i < global.prim; i++) {
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
};
const Change_type = () => {
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
};
/** 値を最小値～最大値の範囲に収めるユーティリティ */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const view_val_f = () => {
    // 入力値取得 → prim オフセットを引いた基準値
    const raw = parseInt(document.getElementById("view_val").value, 10);
    const baseIndex = Number.isNaN(raw) ? 1 : raw - global.prim * 55;

    /** index は以降変更しない */
    const index = clamp(baseIndex, 1, global.maxlen * 55);

    // 入力欄を正規化した値で更新
    document.getElementById("view_val").value = index + global.prim * 55;

    /* ------------------------- 乱数 30 個の描画 ------------------------- */
    const cells = [];
    for (let i = 0; i < 30; i++) {
        const val = global.vv[index + i];
        const text = String(val + 99).slice(1);
        cells.push(ox(val) ? `<span class="maru">${text}</span>` : `<span class="batsu">${text}</span>`);
    }
    document.getElementById("view_val_v").innerHTML = cells.join(" ");

    /* ------------------------- マップ部表示 ----------------------------- */
    const sp = Math.floor(index / 55);
    document.getElementById("map_val_n").innerHTML = randtable(sp, index, -1);

    /* ------------------------- 後続処理 -------------------------------- */
    sub_val_f();
    lvup(0, 0);
    yosoku();
};

const view_val_updown = (v) => {
    document.getElementById("view_val").value -= -v;
    view_val_f();
};
const lv_val_glance = () => {
    //目標位置先読み
    const baseIndex = parseInt(document.getElementById("lv_val").value) - global.prim * 55;
    const glanceOffset = document.getElementById("glance_ck").checked ? document.getElementById("glance").selectedIndex - 999 : 0;
    return baseIndex + glanceOffset;
};
const glance_a = () => {
    //先読み反映
    const lvVal = parseInt(document.getElementById("lv_val").value);
    const glanceOffset = document.getElementById("glance").selectedIndex - 999;
    document.getElementById("lv_val").value = lvVal + glanceOffset;
    document.getElementById("glance_ck").checked = 0;
    lv_val_f();
};

const lv_val_f = () => {
    //目標位置
    const raw = parseInt(document.getElementById("lv_val").value, 10);
    const baseIndex = Number.isNaN(raw) ? 1 : raw - global.prim * 55;
    const fixedIndex = clamp(baseIndex, 0, global.maxlen * 55);

    // 入力欄を正規化した値で更新
    document.getElementById("lv_val").value = fixedIndex + global.prim * 55;

    /* ------------------------- 以降 index は不変 ------------------------ */
    const index = lv_val_glance();

    /* ------------------------- 乱数 30 個の描画 ------------------------- */
    const cells = Array.from({ length: 30 }, (_, i) => {
        const pos = index + i;
        if (pos < 0 || pos > global.maxlen * 55 + 55) return "--";

        const text = String(global.vv[pos] + 99).slice(1);
        return ox(global.vv[pos]) ? `<span class="maru">${text}</span>` : `<span class="batsu">${text}</span>`;
    });
    document.getElementById("lv_val_v").innerHTML = cells.join(" ");

    /* ------------------------- マップ部表示 ----------------------------- */
    const sp = Math.floor(index / 55);
    const maps = [0, 1].map((offset) => randtable(sp + offset, index, -1));
    document.getElementById("map_val_t").innerHTML = maps.join("<br>");

    /* ------------------------- 後続処理 -------------------------------- */
    sub_val_f();
    battle();
};
const lv_val_updown = (v) => {
    document.getElementById("lv_val").value -= -v;
    lv_val_f();
};
const sub_val_f = () => {
    //差
    let i;
    const mv = document.getElementById("mv").selectedIndex;
    const start = parseInt(document.getElementById("view_val").value) - global.prim * 55;
    const last = lv_val_glance();
    const len = last - start;
    document.getElementById("sub_val").innerHTML = len;
    if (len < 0 || last > global.maxlen * 55 + 55) {
        document.getElementById("sub_hfal").innerHTML = "　　　";
        document.getElementById("sub_vfal").innerHTML = "　　　";
        return false;
    }
    let fc = 0;
    let ft = 0;
    let lvv = 0;
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
};
const addw = (i, v) => {
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
};
const lvup = (flag, v) => {
    //上昇量表示
    let i;
    let u;
    let up;
    let gr;
    let index;
    let plsp;
    if (flag) {
        index = lv_val_glance();
        plsp = parseInt(document.getElementById("pls").value);
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
};
const ch_OnChange = (flag) => {
    //ユニット選択変更
    const j = document.getElementById("unitname").selectedIndex;
    for (let i = 0; i < global.prct; i++) {
        document.getElementById(global.prvn[i]).value = global.ud[j][i + 1];
    }
    document.getElementById("react").value = global.ud[j][global.prct + 1];
    for (let i = 0; i < global.rict; i++) {
        global.ringselect[i] = 0;
    }
    afua_change();
    if (flag) {
        if (document.getElementById("search_type").selectedIndex != 2) {
            document.getElementById("search_type").selectedIndex = 0;
        }
        calc_lvlup();
    }
};
const afua_change = () => {
    //聖戦士の書
    let i, j;
    let pr = [];
    for (j = 0; j < global.prct; j++) {
        pr[j] = parseInt(document.getElementById(global.prvn[j]).value);
    }
    for (i = 0; i < global.rict; i++) {
        const o = global.ringselect[i];
        const n = document.getElementById("afua" + i).selectedIndex;
        for (j = 0; j < global.prct; j++) {
            pr[j] -= global.ring[o][j + 1] - global.ring[n][j + 1];
        }
        global.ringselect[i] = n;
    }
    for (j = 0; j < global.prct; j++) {
        document.getElementById(global.prvn[j]).value = pr[j];
    }
    calc_lvlup();
};
const randtable = (sp, indexs, indexl) => {
    let st;
    const ret = [];
    ret.push("No." + (sp + global.prim + 1) + "<br>");
    if (sp < 0 || sp > global.maxlen + 1) {
        for (let i = 0; i < 24; i++) {
            ret.push(" --");
        }
        ret.push("<br>");
        for (let i = 0; i < 24; i++) {
            ret.push(" --");
        }
        ret.push("<br>");
        for (let i = 0; i < 7; i++) {
            ret.push(" --");
        }
        return ret.join("");
    }
    sp *= 55;
    for (let i = 0; i < 24; i++) {
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
    for (let i = 0; i < 24; i++) {
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
    for (let i = 0; i < 7; i++) {
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
};
const createTable = (f) => {
    //乱数表表示
    if (f == 1) {
        const ranvalue = [];
        const map = mapselected(0);
        for (let i = 0; i < global.maxlen * 55; i++) {
            ranvalue.push(String(global.vv[i] + 99).slice(1));
        }
        document.getElementById("randnum").innerHTML = "map:" + map + "<br>" + ranvalue.join(" ");
    } else if (f == 2) {
        const ret = [];
        const indexs = parseInt(document.getElementById("view_val").value) - global.prim * 55;
        const indexl = lv_val_glance();
        const map = mapselected(0);
        for (let i = 0; i <= global.maxlen; i++) {
            ret.push(randtable(i, indexs, indexl));
        }
        document.getElementById("randnum").innerHTML = "map:" + map + "<br>" + ret.join("<br>");
    } else {
        document.getElementById("randnum").innerHTML = "";
    }
};
const ch_all = () => {
    //一括変更
    if (document.getElementById("chall").selectedIndex) {
        for (let i = 0; i < global.prct; i++) {
            document.getElementById("ch" + global.prvn[i]).selectedIndex = document.getElementById("chall").selectedIndex - 1;
        }
        document.getElementById("chall").selectedIndex = 0;
        calc_lvlup();
    }
};
const calc_lvlup = () => {
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
};
const kouho_show = (ret) => {
    //候補表示
    const cnt = ret.length;
    if (cnt == 0) {
        document.getElementById("kouho").innerHTML = "見つかりませんでした";
    } else {
        if (cnt > global.lvupmax) {
            ret = ret.slice(0, global.lvupmax);
            ret.push("...");
        }
        document.getElementById("kouho").innerHTML = "候補数：" + cnt + "<br>" + ret.join(" ");
    }
};
const calc_lvlup_lv = (all) => {
    //レベルアップ候補
    let i;
    let f;
    const ret = [];
    global.kouho_vv = [];
    global.kouho_vv2 = [];
    let minup = document.getElementById("growmin").selectedIndex;
    let maxup = document.getElementById("growmax").selectedIndex;
    const diff = [];
    const gr = [];
    const gh = [];
    let j = 0;
    let k = 0;
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
    const l = all ? global.maxlen * 55 : global.battle_vv.length;
    for (k = 0; k < l; k++) {
        i = all ? k : global.battle_vv[k] - global.prim * 55 + global.battle_vv2[k];
        f = 0;
        let sumc = 0;
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
};
const kouho_updown = (v) => {
    //前後の候補
    v -= 0;
    let i;
    const nowval = parseInt(document.getElementById("lv_val").value);
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
};
const kouho_next = (f) => {
    //現在の次の候補
    let i;
    const nowval = parseInt(document.getElementById("view_val").value);
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
};
const all_show = (flag) => {
    //全て表示
    const ret = flag ? global.kouho_vv : global.search_vv;
    if (flag) {
        document.getElementById("kouho").innerHTML = "候補数：" + ret.length + "<br>" + ret.join(" ");
    } else {
        document.getElementById("search_m_ret").innerHTML = "候補数：" + ret.length + "<br>" + ret.join(" ");
    }
};
const search_mx_onchange = () => {
    //現在位置検索ボタン
    const lox = document.getElementById("search_ma").value;
    global.search_vv = [];
    if (lox.length < 4) {
        document.getElementById("search_m_ret").innerHTML = "４文字以上入力してください";
        document.getElementById("search_len").innerHTML = "-";
        return false;
    }
    search_m_onchange();
};
const search_m_onchange = () => {
    //現在位置検索
    let i, j, k;
    let cnt;
    const pl = document.getElementById("inpl").checked ? 1 : 0;
    const seed = mapselected(0);
    let type = document.getElementById("search_dtb").checked;
    const lox = document.getElementById("search_ma").value;
    if (!lox) {
        document.getElementById("search_m_ret").innerHTML = "";
        document.getElementById("search_len").innerHTML = 0;
        return false;
    }
    const lox2 = [];
    let len = lox.length;
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
        let ret = [];
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
        let ret = [];
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
                    // Instead of using innerHTML, append elements directly
                    let container = document.getElementById("search_m_ret");
                    let br = document.createElement("br");
                    container.appendChild(br);

                    let span = document.createElement("span");
                    span.className = "chmap";
                    span.onclick = (function (idx) {
                        return function () {
                            change_map(1, idx);
                        };
                    })(i);
                    span.textContent = i + ":" + ret[i].join(" ");
                    container.appendChild(span);
                }
            }
        }
    }
};
const ox = (r) => {
    return global.svv_tora[(r %= 25)];
};
const search_updown = (v) => {
    //次の位置
    v = parseInt(v);
    let i;
    const nowval = parseInt(document.getElementById("view_val").value);
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
};
const search_thread = () => {
    let lvf = 0;
    let rvv = [];
    let rec = [];
    let t_rec = [];
    let renstr = [];
    let sv = [];
    let rstr = document.getElementById("search_mc").value;
    if (!rstr.length) {
        document.getElementById("kouho").innerHTML = "";
        return;
    }
    rstr = rstr.replace(/\r\n/g, "\n");
    rvv = rstr.split("\n");
    for (let i = 0; i < rvv.length; i++) {
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

            let min, max;
            let l_type;
            for (let j = 0; j < rec.length; j++) {
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
};
const do_search_thread = (sv) => {
    let matchflag;
    calc_lvlup_lv(1);
    global.kouho_vv = [];
    for (let i = 0; i < global.maxlen * 55; i++) {
        let p = 0;
        for (let j = 0; j < sv.length; j++) {
            matchflag = 0;
            for (let k = 0; k * 3 < sv[j].length; k++) {
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
};
const thread_lvup = () => {
    const str = document.getElementById("search_mc").value;
    if (str.length && str.slice(str.length - 1) != "\n") {
        document.getElementById("search_mc").value += "\n";
    }
    document.getElementById("search_mc").value += "lvup()";
};
const addt = (i, v) => {
    return "<span title='" + addw(i - 1, v) + "' class=ttl>" + v + "</span>";
};
const battle_kougeki = (ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) => {
    let gekko = 0;
    let taiyo = 0;
    let otate = 0;
    let hissatsu = 0;
    let meichu = 0;
    let noroi = 0;
    let kodt = [2, 1, 1, 4, 3, 3][type];
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
    let jcrt;
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
        let dmg = Math.max(0, para[ater][0] * (1 + hissatsu) - para[1 - ater][1] * (1 - gekko));
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
};
const battle_koudou = (ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) => {
    let ct = 1;
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
    for (let i = 0; i < ct; i++) {
        atju.push(ater);
        attp.push(type);
    }
    return index;
};
const battle2 = (hp, hitcnt, sklsws, para, skill, index) => {
    const atju = [];
    const attp = [];
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
};
const battle = () => {
    const hp = [
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
        document.getElementById("atmhp").selectedIndex + 1,
        document.getElementById("dfmhp").selectedIndex + 1,
        document.getElementById("athp").selectedIndex + 1,
        document.getElementById("dfhp").selectedIndex + 1,
    ];
    const para = [];
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
    const skill = [];
    skill[0] = [1, document.getElementById("attsuigeki").checked];
    skill[1] = [document.getElementById("hangeki").checked, document.getElementById("dftsuigeki").checked];
    for (let i = 0; i < global.skilln; i++) {
        skill[0][i + 2] = document.getElementById("atskill" + i).checked;
        skill[1][i + 2] = document.getElementById("dfskill" + i).checked;
    }
    const m = [skill[0][12], skill[1][12]];
    let hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    let sklsws = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ];
    let index = lv_val_glance();
    let index_p = index;
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
};
const battle_s = () => {
    document.getElementById("bt_kouho").innerHTML = "未検索";
    battle();
};
const battle_ss = (f) => {
    if (f == 0 && document.getElementById("attsuigeki").checked) {
        document.getElementById("dftsuigeki").checked = 0;
    } else if (f == 1 && !document.getElementById("hangeki").checked) {
        document.getElementById("dftsuigeki").checked = 0;
    } else if (f == 2 && document.getElementById("dftsuigeki").checked) {
        document.getElementById("attsuigeki").checked = 0;
        document.getElementById("hangeki").checked = 1;
    }
    battle_s();
};
const battle_search_kougeki = (ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) => {
    let gekko = 0;
    let taiyo = 0;
    let otate = 0;
    let hissatsu = 0;
    let meichu = 0;
    let noroi = 0;
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
    let jcrt;
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
        let dmg = Math.max(0, para[ater][0] * (1 + hissatsu) - para[1 - ater][1] * (1 - gekko));
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
};
const battle_search_koudou = (ater, type, hp, hitcnt, sklsws, para, skill, atju, attp, index) => {
    let ct = 1;
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
    for (let i = 0; i < ct; i++) {
        atju.push(ater);
        attp.push(type);
    }
    return index;
};
const battle_search2 = (hp, hitcnt, sklsws, para, skill, index) => {
    const atju = [];
    const attp = [];
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
};
const battle_search1 = () => {
    global.battle_vv = [];
    global.battle_vv2 = [];
    const hp = [
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
    const para = [];
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
    let hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    const sklsws = [];
    const skill = [];
    skill[0] = [1, document.getElementById("attsuigeki").checked];
    skill[1] = [document.getElementById("hangeki").checked, document.getElementById("dftsuigeki").checked];
    for (let i = 0; i < global.skilln; i++) {
        skill[0][i + 2] = document.getElementById("atskill" + i).checked;
        skill[1][i + 2] = document.getElementById("dfskill" + i).checked;
    }
    const m = [skill[0][12], skill[1][12]];
    for (let i = 1; i < global.maxlen * 55; i++) {
        let index;
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
};
const battle_search = () => {
    document.getElementById("bt_kouho").innerHTML = "検索中です…";
    window.setTimeout(battle_search1, 1);
};
const yosoku = () => {
    const start = parseInt(document.getElementById("view_val").value) - global.prim * 55;
    const last = lv_val_glance();
    if (start > last) {
        document.getElementById("yosokukai").innerHTML = "----";
        return 0;
    }
    const hp = [
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
    const para = [];
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
    let hitcnt = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0];
    const sklsws = [];
    const skill = [];
    skill[0] = [1, document.getElementById("attsuigeki").checked];
    skill[1] = [document.getElementById("hangeki").checked, document.getElementById("dftsuigeki").checked];
    for (let i = 0; i < global.skilln; i++) {
        skill[0][i + 2] = document.getElementById("atskill" + i).checked;
        skill[1][i + 2] = document.getElementById("dfskill" + i).checked;
    }
    const m = [skill[0][12], skill[1][12]];
    let index = start;
    let index2 = index;
    let cnt = -1;
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
};
const displaystyle = (hlay, blay) => {
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
};

// Helper function to create a select element with options and default selected index
const createSelect = (id, count, defaultIndex, onchange, startFromOne) => {
    const select = document.createElement("select");
    select.id = id;
    select.setAttribute("onchange", onchange);
    for (let i = 0; i < count; i++) {
        let option = document.createElement("option");
        option.textContent = startFromOne ? i + 1 : i;
        select.appendChild(option);
    }
    select.selectedIndex = defaultIndex;
    return select;
};

const init = () => {
    //初期化
    pikasort(0);
    createTable(0);
    ch_OnChange(0);
    search_m_onchange();
    reset();
    document.getElementById("mainwindow").style.visibility = "visible";
};
// Insert the selects for the defender side
window.addEventListener("DOMContentLoaded", () => {
    // Glance select
    (() => {
        const glance = document.getElementById("glance");
        for (let i = -999; i < 1001; i++) {
            const option = document.createElement("option");
            option.textContent = i;
            glance.appendChild(option);
        }
        glance.selectedIndex = 999;
    })();

    // Unitname select
    (() => {
        const unitname = document.getElementById("unitname");
        for (const ud of global.ud) {
            const option = document.createElement("option");
            option.textContent = ud[0];
            unitname.appendChild(option);
        }
        unitname.selectedIndex = global.unitindex;
    })();

    // Parameter table rows
    (() => {
        const tbody = document.getElementById("paramTableBody");
        for (let i = 0; i < global.prct; i++) {
            const tr = document.createElement("tr");

            // Parameter name
            const tdName = document.createElement("td");
            tdName.className = "view";
            tdName.textContent = global.para[i] + "：";
            tr.appendChild(tdName);

            // Input box
            const tdInput = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.id = global.prvn[i];
            input.size = 4;
            input.className = "view";
            tdInput.appendChild(input);
            tr.appendChild(tdInput);

            // Select box
            const tdSelect = document.createElement("td");
            const select = document.createElement("select");
            select.id = "ch" + global.prvn[i];
            const opts = ["上昇しないとダメ", "+1以上上昇", "どちらでもよい", "上昇しちゃダメ", "--MAX--"];
            for (let j = 0; j < opts.length; j++) {
                const option = document.createElement("option");
                option.textContent = opts[j];
                if (j === 2) option.selected = true;
                select.appendChild(option);
            }
            tdSelect.appendChild(select);
            tr.appendChild(tdSelect);

            // Result columns
            const tdPL = document.createElement("td");
            tdPL.id = global.prvn[i] + "pl";
            tdPL.className = "view";
            tr.appendChild(tdPL);

            const tdPM = document.createElement("td");
            tdPM.id = global.prvn[i] + "pm";
            tdPM.className = "view";
            tr.appendChild(tdPM);

            const tdPP = document.createElement("td");
            tdPP.id = global.prvn[i] + "pp";
            tdPP.className = "view";
            tr.appendChild(tdPP);

            tbody.insertBefore(tr, tbody.children[tbody.children.length - 1]);
        }
    })();

    // Growmin and growmax selects
    (() => {
        const growmin = document.getElementById("growmin");
        const growmax = document.getElementById("growmax");
        for (let i = 0; i < global.prct + 1; i++) {
            const option1 = document.createElement("option");
            option1.textContent = i;
            growmin.appendChild(option1);

            const option2 = document.createElement("option");
            option2.textContent = i;
            growmax.appendChild(option2);
        }
        growmin.selectedIndex = 8;
        growmax.selectedIndex = global.prct;
    })();

    // Ring selects
    (() => {
        const container = document.getElementById("ringContainer");
        for (let i = 0; i < global.rict; i++) {
            const select = document.createElement("select");
            select.id = "afua" + i;
            for (let j = 0; j < global.ring.length; j++) {
                const option = document.createElement("option");
                option.textContent = global.ring[j][0];
                select.appendChild(option);
            }
            select.selectedIndex = 0;
            container.appendChild(select);
            container.appendChild(document.createElement("br"));
        }
    })();

    // Battle: attacker selects
    (() => {
        const fillSelect = (id, count, offset, selected) => {
            const sel = document.getElementById(id);
            for (let i = 0; i < count; i++) {
                const option = document.createElement("option");
                option.textContent = i + (offset || 0);
                sel.appendChild(option);
            }
            sel.selectedIndex = selected || 0;
        };
        fillSelect("athp", 80, 1, 39);
        fillSelect("atmhp", 80, 1, 59);
        fillSelect("atatc", 100, 0, 20);
        fillSelect("atdef", 51, 0, 10);
        fillSelect("athit", 101, 0, 90);
        fillSelect("atcrt", 101, 0, 10);
        fillSelect("atcrtkei", 6, 0, 1);
        fillSelect("atlvl", 20, 1, 9);
        fillSelect("atskl", 41, 0, 10);
        fillSelect("atspd", 41, 0, 10);
        fillSelect("atluck", 31, 0, 10);
    })();

    // Battle: attacker skill checkboxes
    (() => {
        const container = document.getElementById("atskillContainer");
        for (let i = 0; i < global.skilln; i++) {
            const span = document.createElement("span");
            span.className = "cbx";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "atskill" + i;
            checkbox.value = "1";

            const label = document.createElement("label");
            label.htmlFor = "atskill" + i;
            label.textContent = global.skilllist[i];

            span.appendChild(checkbox);
            span.appendChild(label);
            container.appendChild(span);
            container.appendChild(document.createTextNode(" "));
        }
    })();

    // Battle: defender selects
    (() => {
        const fillSelect = (id, count, offset, selected) => {
            const sel = document.getElementById(id);
            for (let i = 0; i < count; i++) {
                const option = document.createElement("option");
                option.textContent = i + (offset || 0);
                sel.appendChild(option);
            }
            sel.selectedIndex = selected || 0;
        };
        fillSelect("dfhp", 80, 1, 39);
        fillSelect("dfmhp", 80, 1, 59);
        fillSelect("dfatc", 100, 0, 20);
        fillSelect("dfdef", 51, 0, 10);
        fillSelect("dfhit", 101, 0, 90);
        fillSelect("dfcrt", 101, 0, 10);
        fillSelect("dfcrtkei", 6, 0, 1);
        fillSelect("dflvl", 20, 1, 9);
        fillSelect("dfskl", 41, 0, 10);
        fillSelect("dfspd", 41, 0, 10);
        fillSelect("dfluck", 31, 0, 10);
    })();

    // Battle: defender skill checkboxes
    (() => {
        const container = document.getElementById("dfskillContainer");
        for (let i = 0; i < global.skilln; i++) {
            const span = document.createElement("span");
            span.className = "cbx";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "dfskill" + i;
            checkbox.value = "1";

            const label = document.createElement("label");
            label.htmlFor = "dfskill" + i;
            label.textContent = global.skilllist[i];

            span.appendChild(checkbox);
            span.appendChild(label);
            container.appendChild(span);
            container.appendChild(document.createTextNode(" "));
        }
    })();

    // Battle: attacker min/max HP selects
    (() => {
        const fillSelect = (id, count, offset, selected) => {
            const sel = document.getElementById(id);
            for (let i = 0; i < count; i++) {
                const option = document.createElement("option");
                option.textContent = i + (offset || 0);
                sel.appendChild(option);
            }
            sel.selectedIndex = selected || 0;
        };
        fillSelect("athpmin", 81, 0, 1);
        fillSelect("athpmax", 81, 0, 80);
    })();

    // Battle: defender min/max HP selects
    (() => {
        const fillSelect = (id, count, offset, selected) => {
            const sel = document.getElementById(id);
            for (let i = 0; i < count; i++) {
                const option = document.createElement("option");
                option.textContent = i + (offset || 0);
                sel.appendChild(option);
            }
            sel.selectedIndex = selected || 0;
        };
        fillSelect("dfhpmin", 81, 0, 0);
        fillSelect("dfhpmax", 81, 0, 0);
    })();

    // onload
    init();

    // Button events
    document.getElementById("btn_next").onclick = next;
    document.getElementById("btn_change_max").onclick = change_max;

    // view_val events
    document.getElementById("view_val").onchange = view_val_f;
    document.getElementById("btn_view_val_updown_m55").onclick = () => view_val_updown(-55);
    document.getElementById("btn_view_val_updown_m10").onclick = () => view_val_updown(-10);
    document.getElementById("btn_view_val_updown_m1").onclick = () => view_val_updown(-1);
    document.getElementById("btn_view_val_updown_1").onclick = () => view_val_updown(1);
    document.getElementById("btn_view_val_updown_10").onclick = () => view_val_updown(10);
    document.getElementById("btn_view_val_updown_55").onclick = () => view_val_updown(55);
    document.getElementById("btn_view_val_set_lv_val").onclick = () => {
        document.getElementById("view_val").value = document.getElementById("lv_val").value;
        view_val_f();
    };

    // lv_val events
    document.getElementById("lv_val").onchange = lv_val_f;
    document.getElementById("btn_lv_val_updown_m55").onclick = () => lv_val_updown(-55);
    document.getElementById("btn_lv_val_updown_m10").onclick = () => lv_val_updown(-10);
    document.getElementById("btn_lv_val_updown_m1").onclick = () => lv_val_updown(-1);
    document.getElementById("btn_lv_val_updown_1").onclick = () => lv_val_updown(1);
    document.getElementById("btn_lv_val_updown_10").onclick = () => lv_val_updown(10);
    document.getElementById("btn_lv_val_updown_55").onclick = () => lv_val_updown(55);
    document.getElementById("btn_lv_val_set_view_val").onclick = () => {
        document.getElementById("lv_val").value = document.getElementById("view_val").value;
        lv_val_f();
    };

    // glance
    document.getElementById("glance_ck").onclick = lv_val_f;
    document.getElementById("glance").onchange = lv_val_f;
    document.getElementById("glance").onkeyup = lv_val_f;
    document.getElementById("btn_glance_a").onclick = glance_a;

    // search
    document.getElementById("search_dtb").onclick = search_m_onchange;
    document.getElementById("search_ma").onkeyup = search_m_onchange;
    document.getElementById("btn_search_ma_o").onclick = () => {
        document.getElementById("search_ma").value += "o";
        search_mx_onchange();
    };
    document.getElementById("btn_search_ma_x").onclick = () => {
        document.getElementById("search_ma").value += "x";
        search_mx_onchange();
    };
    document.getElementById("btn_search_ma_clear").onclick = () => {
        document.getElementById("search_ma").value = "";
        search_m_onchange();
    };
    document.getElementById("btn_search_updown_m1").onclick = () => search_updown(-1);
    document.getElementById("btn_search_updown_1").onclick = () => search_updown(1);
    document.getElementById("btn_all_show_0").onclick = () => all_show(0);
    document.getElementById("inpl").onclick = search_m_onchange;

    // pikacheck
    document.getElementById("pikacheck").onclick = () => pikasort(1);

    // mapsw
    document.getElementById("mapsw").onclick = map_swap;

    // search_type
    document.getElementById("search_type").onchange = Change_type;

    // displaystyle
    document.getElementById("btn_displaystyle_tlvup").onclick = () => displaystyle("tlvup", 0);

    // unitname
    document.getElementById("unitname").onchange = () => ch_OnChange(1);
    document.getElementById("unitname").onkeyup = () => ch_OnChange(1);
    document.getElementById("btn_unitname_set").onclick = () => ch_OnChange(1);

    // chall
    document.getElementById("chall").onchange = ch_all;

    // pls
    document.getElementById("pls").onchange = () => {
        document.getElementById("plkae").checked = 0;
        lvup(1, 0);
    };

    // growmin/growmax
    document.getElementById("growmin").onchange = calc_lvlup;
    document.getElementById("growmax").onchange = calc_lvlup;

    // afua
    for (let i = 0; i < global.rict; i++) {
        const afua = document.getElementById("afua" + i);
        if (afua) afua.onchange = afua_change;
    }

    // mv
    document.getElementById("mv").onchange = Change_type;

    // chreact
    document.getElementById("chreact").onchange = calc_lvlup;

    // react
    document.getElementById("react").onchange = calc_lvlup;

    // ch* for each param
    for (let i = 0; i < global.prct; i++) {
        const ch = document.getElementById("ch" + global.prvn[i]);
        if (ch) ch.onchange = calc_lvlup;
        const inp = document.getElementById(global.prvn[i]);
        if (inp) inp.onchange = calc_lvlup;
    }

    // kouho
    document.getElementById("btn_kouho_updown_m1").onclick = () => kouho_updown(-1);
    document.getElementById("btn_kouho_updown_1").onclick = () => kouho_updown(1);
    document.getElementById("btn_kouho_next").onclick = () => kouho_next(1);
    document.getElementById("btn_all_show_1").onclick = () => all_show(1);

    // search_thread
    document.getElementById("btn_search_thread").onclick = search_thread;
    document.getElementById("btn_thread_lvup").onclick = thread_lvup;

    // yosoku
    document.getElementById("btn_yosoku").onclick = yosoku;

    // battle_search
    document.getElementById("btn_battle_search").onclick = battle_search;

    // battle_s, battle_ss
    document.getElementById("athp").onchange = battle_s;
    document.getElementById("atmhp").onchange = battle_s;
    document.getElementById("atatc").onchange = battle_s;
    document.getElementById("atdef").onchange = battle_s;
    document.getElementById("athit").onchange = battle_s;
    document.getElementById("atcrt").onchange = battle_s;
    document.getElementById("atcrtkei").onchange = battle_s;
    document.getElementById("atlvl").onchange = battle_s;
    document.getElementById("atskl").onchange = battle_s;
    document.getElementById("atspd").onchange = battle_s;
    document.getElementById("atluck").onchange = battle_s;
    for (let i = 0; i < global.skilln; i++) {
        const atskill = document.getElementById("atskill" + i);
        if (atskill) atskill.onclick = battle_s;
    }
    document.getElementById("attsuigeki").onclick = () => battle_ss(0);

    // Defender side (created by script)
    document.getElementById("hangeki").onclick = () => battle_ss(1);
    document.getElementById("dftsuigeki").onclick = () => battle_ss(2);
    for (let i = 0; i < global.skilln; i++) {
        const dfskill = document.getElementById("dfskill" + i);
        if (dfskill) dfskill.onclick = battle_s;
    }
    ["dfhp", "dfmhp", "dfatc", "dfdef", "dfhit", "dfcrt", "dfcrtkei", "dflvl", "dfskl", "dfspd", "dfluck"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.onchange = battle_s;
    });

    // HP min/max and sleep
    document.getElementById("athpmin").onchange = battle_s;
    document.getElementById("athpmax").onchange = battle_s;
    document.getElementById("athitf").onclick = battle_s;
    document.getElementById("dfhpmin").onchange = battle_s;
    document.getElementById("dfhpmax").onchange = battle_s;
    document.getElementById("dfhitf").onclick = battle_s;

    // sakiyomi/plkae
    document.getElementById("sakiyomi").onclick = battle_s;
    document.getElementById("plkae").onclick = battle_s;

    // createTable
    document.getElementById("btn_create_table_1").onclick = () => createTable(1);
    document.getElementById("btn_create_table_2").onclick = () => createTable(2);
    document.getElementById("btn_create_table_0").onclick = () => createTable(0);

    const container = document.getElementById("dfhp").parentElement;
    // Remove old selects and scripts
    while (container.firstChild) container.removeChild(container.firstChild);

    container.appendChild(document.createTextNode("HP"));
    container.appendChild(createSelect("dfhp", 80, 39, "battle_s();", true));
    container.appendChild(document.createTextNode(" 最大HP"));
    container.appendChild(createSelect("dfmhp", 80, 59, "battle_s();", true));
    container.appendChild(document.createTextNode(" 攻撃"));
    container.appendChild(createSelect("dfatc", 100, 20, "battle_s();", false));
    container.appendChild(document.createTextNode(" 防御"));
    container.appendChild(createSelect("dfdef", 51, 10, "battle_s();", false));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createTextNode("命中"));
    container.appendChild(createSelect("dfhit", 101, 40, "battle_s();", false));
    container.appendChild(document.createTextNode(" 必殺"));
    container.appendChild(createSelect("dfcrt", 101, 2, "battle_s();", false));
    container.appendChild(document.createTextNode(" 必殺係数"));
    container.appendChild(createSelect("dfcrtkei", 6, 1, "battle_s();", false));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createTextNode("Lv"));
    container.appendChild(createSelect("dflvl", 20, 9, "battle_s();", true));
    container.appendChild(document.createTextNode(" 技"));
    container.appendChild(createSelect("dfskl", 41, 5, "battle_s();", false));
    container.appendChild(document.createTextNode(" 攻速"));
    container.appendChild(createSelect("dfspd", 41, 5, "battle_s();", false));
    container.appendChild(document.createTextNode(" 運"));
    container.appendChild(createSelect("dfluck", 31, 5, "battle_s();", false));
});
