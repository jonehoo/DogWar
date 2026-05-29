"use strict";

const wxApi = typeof wx !== "undefined" ? wx : null;
const shared = typeof globalThis !== "undefined" ? globalThis.sharedCanvas : null;

if (!wxApi || !shared) {
  // 非微信开放数据域环境直接退出
} else {
  const ctx = shared.getContext("2d");
  const RANK_KEY = "rank";
  const MAX_ROWS = 10;
  const ROW_H = 56;
  const START_Y = 138;
  const LEFT_X = 56;
  const RIGHT_X_OFFSET = 56;

  let state = {
    visible: false,
    payload: { score: 0, chapter: 0, time: 0 },
    rows: [],
    selfOpenId: "",
  };

  function safeNum(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  }

  function clear() {
    ctx.clearRect(0, 0, shared.width, shared.height);
  }

  function clampRows() {
    if (state.rows.length > MAX_ROWS) {
      state.rows = state.rows.slice(0, MAX_ROWS);
    }
  }

  function parseRankKV(kvList) {
    if (!Array.isArray(kvList)) return null;
    const kv = kvList.find((item) => item && item.key === RANK_KEY);
    if (!kv || typeof kv.value !== "string" || kv.value.length === 0) return null;
    try {
      const parsed = JSON.parse(kv.value);
      return {
        score: safeNum(parsed.score, 0),
        chapter: safeNum(parsed.chapter, 0),
        time: safeNum(parsed.time, 0),
        updateAt: safeNum(parsed.updateAt, 0),
      };
    } catch (e) {
      return null;
    }
  }

  function buildValueText(rank) {
    return "第" + (rank.chapter + 1) + "关  分 " + rank.score + "  " + rank.time + "s";
  }

  function drawRoundRect(x, y, w, h, r, color) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function rankColor(i) {
    if (i === 0) return "#F6C651";
    if (i === 1) return "#D1DBF5";
    if (i === 2) return "#D8A988";
    return "#78A6FF";
  }

  function shortName(name) {
    const n = name || "微信玩家";
    return n.length > 8 ? n.slice(0, 8) + "..." : n;
  }

  function compareRank(a, b) {
    if (a.rank.chapter !== b.rank.chapter) return b.rank.chapter - a.rank.chapter;
    if (a.rank.score !== b.rank.score) return b.rank.score - a.rank.score;
    if (a.rank.time !== b.rank.time) return a.rank.time - b.rank.time;
    return b.rank.updateAt - a.rank.updateAt;
  }

  function drawPanel() {
    clear();
    if (!state.visible) return;

    const bg = ctx.createLinearGradient(0, 0, 0, shared.height);
    bg.addColorStop(0, "#0F1425");
    bg.addColorStop(1, "#1C2948");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, shared.width, shared.height);

    drawRoundRect(20, 20, shared.width - 40, shared.height - 40, 24, "rgba(8, 12, 24, 0.72)");
    drawRoundRect(28, 28, shared.width - 56, 88, 18, "rgba(67, 134, 255, 0.22)");

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("好友排行榜", shared.width / 2, 76);

    ctx.fillStyle = "#C0D2FF";
    ctx.font = "22px sans-serif";
    ctx.fillText("排序: 关卡 > 分数 > 用时", shared.width / 2, 106);

    ctx.textAlign = "left";
    state.rows.forEach((item, idx) => {
      const y = START_Y + idx * ROW_H;
      const isSelf = item.openid && item.openid === state.selfOpenId;
      const cardX = 34;
      const cardY = y - 36;
      const cardW = shared.width - 68;
      const cardH = 44;

      drawRoundRect(cardX, cardY, cardW, cardH, 10, "rgba(120, 147, 205, 0.16)");

      if (isSelf) {
        drawRoundRect(cardX, cardY, cardW, cardH, 10, "rgba(60, 182, 255, 0.30)");
      }

      ctx.beginPath();
      ctx.arc(LEFT_X + 8, y - 10, 12, 0, Math.PI * 2);
      ctx.fillStyle = rankColor(idx);
      ctx.fill();

      ctx.fillStyle = "#0E1424";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(idx + 1), LEFT_X + 8, y - 4);
      ctx.textAlign = "left";

      ctx.fillStyle = "#EAF1FF";
      ctx.font = "24px sans-serif";
      ctx.fillText(shortName(item.nickname), LEFT_X + 30, y);

      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "right";
      ctx.fillText(buildValueText(item.rank), shared.width - RIGHT_X_OFFSET, y);
      ctx.textAlign = "left";
    });

    if (state.rows.length === 0) {
      ctx.fillStyle = "#DCE8FF";
      ctx.font = "28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("暂无排行数据，去闯关冲榜吧!", shared.width / 2, shared.height / 2);
      ctx.textAlign = "left";
    }
  }

  function reloadRankList() {
    console.log("[Rank-Sub] 开始拉取好友数据");
    wxApi.getFriendCloudStorage({
      keyList: [RANK_KEY],
      success(res) {
        const list = Array.isArray(res.data) ? res.data : [];
        console.log("[Rank-Sub] 好友数据条数:", list.length, list);
        state.rows = list
          .map((item) => {
            const rank = parseRankKV(item.KVDataList);
            if (!rank) return null;
            return {
              openid: item.openid || "",
              nickname: item.nickname || "",
              rank,
            };
          })
          .filter(Boolean)
          .sort(compareRank);
        clampRows();
        drawPanel();
      },
      fail(err) {
        console.warn("[Rank-Sub] getFriendCloudStorage 失败:", err);
        state.rows = [];
        drawPanel();
      },
    });
  }

  function showRank() {
    console.log("[Rank-Sub] showRank");
    state.visible = true;
    drawPanel();
    reloadRankList();
  }

  function hideRank() {
    state.visible = false;
    clear();
  }

  wxApi.getUserInfo({
    openIdList: ["selfOpenId"],
    lang: "zh_CN",
    success(res) {
      if (res && Array.isArray(res.data) && res.data[0] && res.data[0].openId) {
        state.selfOpenId = res.data[0].openId;
      }
    },
    fail() {},
  });

  wxApi.onMessage((msg) => {
    if (!msg || typeof msg !== "object") return;
    console.log("[Rank-Sub] 收到主域消息:", msg);

    if (msg.message === "rankUpdated" || msg.type === "rankUpdated") {
      if (state.visible) {
        reloadRankList();
      }
      return;
    }

    if (msg.message === "showRank" || msg.type === "showFriendRank") {
      showRank();
      return;
    }

    if (msg.message === "hideRank" || msg.type === "hideFriendRank") {
      hideRank();
    }
  });
}
