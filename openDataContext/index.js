"use strict";

const wxApi = typeof wx !== "undefined" ? wx : null;
const shared = typeof globalThis !== "undefined" ? globalThis.sharedCanvas : null;

if (!wxApi || !shared) {
  // 非微信开放数据域环境直接退出
} else {
  const ctx = shared.getContext("2d");
  const RANK_KEY = "rank";
  const MAX_ROWS = 50;
  const ROW_H = 64;

  let state = {
    visible: false,
    payload: { score: 0, chapter: 0, time: 0 },
    rows: [],
    selfOpenId: "",
  };

  let touchStartY = 0;
  let currentScrollY = 0;
  let isDragging = false;
  let baseScrollY = 0;

  const avatarCache = {};

  function safeNum(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  }

  function clear() {
    try {
      ctx.restore();
    } catch (e) {}
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
    return "第" + (rank.chapter + 1) + "关  " + rank.score + "分  " + rank.time + "s";
  }

  function drawComicRect(x, y, w, h, r, fillColor, strokeColor, strokeWidth, shadowOffset) {
    // 1. Draw solid black shadow first
    if (shadowOffset > 0) {
      ctx.beginPath();
      const sx = x + shadowOffset;
      const sy = y + shadowOffset;
      ctx.moveTo(sx + r, sy);
      ctx.lineTo(sx + w - r, sy);
      ctx.quadraticCurveTo(sx + w, sy, sx + w, sy + r);
      ctx.lineTo(sx + w, sy + h - r);
      ctx.quadraticCurveTo(sx + w, sy + h, sx + w - r, sy + h);
      ctx.lineTo(sx + r, sy + h);
      ctx.quadraticCurveTo(sx, sy + h, sx, sy + h - r);
      ctx.lineTo(sx, sy + r);
      ctx.quadraticCurveTo(sx, sy, sx + r, sy);
      ctx.closePath();
      ctx.fillStyle = "#000000";
      ctx.fill();
    }

    // 2. Draw card main body
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
    
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    
    if (strokeColor && strokeWidth > 0) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  }

  function drawAvatar(avatarUrl, x, y, size) {
    if (!avatarUrl) {
      drawDefaultAvatar(x, y, size);
      return;
    }
    const img = avatarCache[avatarUrl];
    if (img) {
      if (img.loaded) {
        ctx.drawImage(img, x, y, size, size);
      } else {
        drawDefaultAvatar(x, y, size);
      }
    } else {
      const newImg = wxApi.createImage();
      newImg.onload = () => {
        newImg.loaded = true;
        if (state.visible) {
          drawPanel();
        }
      };
      newImg.onerror = () => {
        newImg.failed = true;
      };
      newImg.src = avatarUrl;
      avatarCache[avatarUrl] = newImg;
      drawDefaultAvatar(x, y, size);
    }
  }

  function drawDefaultAvatar(x, y, size) {
    ctx.fillStyle = "#A2B6DF";
    ctx.fillRect(x, y, size, size);
  }

  function drawCircleAvatar(avatarUrl, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.clip();
    drawAvatar(avatarUrl, x, y, radius * 2);
    ctx.restore();
  }

  function rankColor(i) {
    if (i === 0) return "#FFD54F"; // Gold
    if (i === 1) return "#CFD8DC"; // Silver
    if (i === 2) return "#FFE0B2"; // Bronze
    return "#FFFFFF"; // Others
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

  function drawNail(cx, cy) {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#455A64"; // Metal grey
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Highlight
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 2, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  }

  function drawPanel() {
    clear();
    if (!state.visible) return;

    // Outer wood board size
    const boardX = 16;
    const boardY = 16;
    const boardW = shared.width - 32;
    const boardH = shared.height - 32;

    // 1. Draw wood shadow
    drawComicRect(boardX + 6, boardY + 6, boardW, boardH, 20, "#3E221A", null, 0, 0);
    // 2. Draw main wood board
    drawComicRect(boardX, boardY, boardW, boardH, 20, "#794635", "#000000", 4, 0);

    // 3. Draw horizontal plank lines
    ctx.strokeStyle = "#532D20";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boardX + 4, boardY + boardH * 0.25);
    ctx.lineTo(boardX + boardW - 4, boardY + boardH * 0.25);
    ctx.moveTo(boardX + 4, boardY + boardH * 0.5);
    ctx.lineTo(boardX + boardW - 4, boardY + boardH * 0.5);
    ctx.moveTo(boardX + 4, boardY + boardH * 0.75);
    ctx.lineTo(boardX + boardW - 4, boardY + boardH * 0.75);
    ctx.stroke();

    // 4. Draw nails on the wood board
    drawNail(boardX + 16, boardY + 16);
    drawNail(boardX + boardW - 16, boardY + 16);
    drawNail(boardX + 16, boardY + boardH - 16);
    drawNail(boardX + boardW - 16, boardY + boardH - 16);

    // 5. Draw parchment paper scroll
    const paperX = boardX + 24;
    const paperY = boardY + 24;
    const paperW = boardW - 48;
    const paperH = boardH - 48;

    // Draw paper shadow
    drawComicRect(paperX + 4, paperY + 4, paperW, paperH, 12, "#3E221A", null, 0, 0);
    // Draw paper main body
    drawComicRect(paperX, paperY, paperW, paperH, 12, "#F7F2E2", "#000000", 3, 0);

    // 6. Draw green wooden header
    const headerX = paperX + 16;
    const headerY = paperY + 16;
    const headerW = paperW - 32;
    const headerH = 64;
    drawComicRect(headerX, headerY, headerW, headerH, 8, "#26A69A", "#000000", 2.5, 3);

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("好友排行榜", shared.width / 2, headerY + 26);

    ctx.fillStyle = "#B2DFDB";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("排序: 关卡 > 分数 > 用时", shared.width / 2, headerY + 50);

    const START_Y = headerY + headerH + 36;
    const clipTop = headerY + headerH + 12;
    const clipBottom = paperY + paperH - 12;

    if (state.rows.length === 0) {
      drawComicRect(shared.width / 2 - 160, shared.height / 2 - 30, 320, 60, 10, "#FFFDF7", "#D7CCC8", 2, 0);
      ctx.fillStyle = "#4E342E";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("暂无排行数据，去闯关冲榜吧!", shared.width / 2, shared.height / 2 + 5);
      ctx.textAlign = "left";
    } else {
      // Draw scrollable rows with clipping mask
      ctx.save();
      ctx.beginPath();
      ctx.rect(paperX + 4, clipTop, paperW - 8, clipBottom - clipTop);
      ctx.clip();

      try {
        ctx.textAlign = "left";
        state.rows.forEach((item, idx) => {
          const y = START_Y + idx * ROW_H + currentScrollY;
          const isSelf = item.openid && item.openid === state.selfOpenId;

          const cardX = paperX + 12;
          const cardH = 46;
          const cardY = y - cardH / 2;
          const cardW = paperW - 24;

          // Draw Row Highlight for Self
          if (isSelf) {
            drawComicRect(cardX, cardY - 2, cardW, cardH + 4, 6, "rgba(255, 179, 0, 0.15)", "#D7CCC8", 1.5, 0);
          }

          // Draw Rank Badge
          const badgeX = cardX + 20;
          const badgeR = 13;
          drawComicRect(badgeX - badgeR, y - badgeR, badgeR * 2, badgeR * 2, badgeR, rankColor(idx), "#4E342E", 1.8, 0);

          ctx.fillStyle = "#4E342E";
          ctx.font = "bold 15px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(String(idx + 1), badgeX, y + 5);
          ctx.textAlign = "left";

          // Draw Avatar
          const avatarX = cardX + 42;
          const avatarR = 16;
          drawCircleAvatar(item.avatarUrl, avatarX, y - avatarR, avatarR);
          drawComicRect(avatarX, y - avatarR, avatarR * 2, avatarR * 2, avatarR, null, "#4E342E", 1.8, 0);

          // Draw Nickname (dark brown text)
          ctx.fillStyle = "#4E342E";
          ctx.font = "bold 17px sans-serif";
          ctx.fillText(shortName(item.nickname), cardX + 84, y + 6);

          // Draw Stats Capsule
          const capsuleW = 180;
          const capsuleH = 26;
          const capsuleX = cardX + cardW - capsuleW - 8;
          const capsuleY = y - capsuleH / 2;

          drawComicRect(capsuleX, capsuleY, capsuleW, capsuleH, 6, "#FFFDF7", "#D7CCC8", 1.5, 0);

          ctx.fillStyle = "#8D6E63";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(buildValueText(item.rank), capsuleX + capsuleW / 2, y + 4);
          ctx.textAlign = "left";

          // Draw dashed separator line
          if (idx < state.rows.length - 1) {
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = "#D7CCC8";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cardX, y + ROW_H / 2);
            ctx.lineTo(cardX + cardW, y + ROW_H / 2);
            ctx.stroke();
            ctx.restore();
          }
        });
      } finally {
        ctx.restore();
      }
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
              avatarUrl: item.avatarUrl || "",
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
    currentScrollY = 0;
    drawPanel();
    reloadRankList();
  }

  function hideRank() {
    state.visible = false;
    currentScrollY = 0;
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

  wxApi.onTouchStart((e) => {
    if (!state.visible || !e.touches || e.touches.length === 0) return;
    touchStartY = e.touches[0].clientY;
    baseScrollY = currentScrollY;
    isDragging = true;
  });

  wxApi.onTouchMove((e) => {
    if (!state.visible || !isDragging || !e.touches || e.touches.length === 0) return;
    const dy = e.touches[0].clientY - touchStartY;
    let targetScrollY = baseScrollY + dy;

    const boardY = 16;
    const boardH = shared.height - 32;
    const paperY = boardY + 24;
    const paperH = boardH - 48;
    const headerH = 64;
    const clipTop = paperY + 16 + headerH + 12;
    const clipBottom = paperY + paperH - 12;
    const visibleH = clipBottom - clipTop;

    const contentH = state.rows.length * ROW_H;
    const maxScroll = Math.max(0, contentH - visibleH);

    if (targetScrollY > 0) targetScrollY = 0;
    if (targetScrollY < -maxScroll) targetScrollY = -maxScroll;

    currentScrollY = targetScrollY;
    drawPanel();
  });

  wxApi.onTouchEnd(() => {
    isDragging = false;
  });

  if (typeof wxApi.onTouchCancel === "function") {
    wxApi.onTouchCancel(() => {
      isDragging = false;
    });
  }
}

