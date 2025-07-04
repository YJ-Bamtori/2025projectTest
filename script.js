const path = [
  "0d", "1d", "2d", "3d", "4d", "5d", "6d", "7d", "8d", "9d", "10d",
  "11d", "12d", "13d", "14d", "15d", "16d", "17d", "18d", "19d", "0d"
]; // 총 21칸 (인덱스 0~20)

const teams = ["red", "blue", "mint", "yellow"];
let currentTeamIndex = 0;

const redPieces = [
  { idx: 0, position: 0, finished: false },
  { idx: 1, position: 0, finished: false },
  { idx: 2, position: 0, finished: false }
];

const bluePieces = [
  { idx: 0, position: 0, finished: false },
  { idx: 1, position: 0, finished: false },
  { idx: 2, position: 0, finished: false }
];

const mintPieces = [
  { idx: 0, position: 0, finished: false },
  { idx: 1, position: 0, finished: false },
  { idx: 2, position: 0, finished: false }
];

const yellowPieces = [
  { idx: 0, position: 0, finished: false },
  { idx: 1, position: 0, finished: false },
  { idx: 2, position: 0, finished: false }
];

const teamClasses = {
  red: "redBox",
  blue: "blueBox",
  mint: "mintBox",
  yellow: "yellowBox"
};

const teamPieces = {
  red: redPieces,
  blue: bluePieces,
  mint: mintPieces,
  yellow: yellowPieces
};

let currentDice = 0;

function getYutResult(num) {
  switch (num) {
    case -1: return "빽도";
    case 1: return "도";
    case 2: return "개";
    case 3: return "걸";
    case 4: return "윷 🎁";
    case 5: return "모 🎁";
    default: return num;
  }
}

function movePiece(pieceObj, steps, team) {
  // 선택 불가능하게 변경
  $(`.${team}Box`).removeClass("selectable").off("click");

  let newPos = pieceObj.position + steps;

  // 만약 처음부터 -1이면 0에 위치시킴.
  if (newPos < 0) newPos = 0;

  // 한바퀴를 다돌았을 경우
  if (newPos >= path.length) {
    pieceObj.finished = true;
    pieceObj.position = path.length;
    // ❗해당 말이 다시 redrank로 들어가는 내용인데, 완주한 아이콘으로 변경되도록 디자인하기
    $(`.${team}Box[data-id="${pieceObj.idx}"]`).appendTo(`#${capitalize(team)}Rank`);
    return;
  }

  // 말을 해당 칸에 두기.
  const tileId = path[newPos];
  $(`.${team}Box[data-id="${pieceObj.idx}"]`).appendTo("#" + tileId);
  pieceObj.position = newPos;
}

function pieceSelect() {
  const currentTeam = teams[currentTeamIndex];
  const pieceClass = teamClasses[currentTeam];
  const pieces = teamPieces[currentTeam];

  $(`.${pieceClass}`).each(function () {
    // 내가 선택한 말이 뭔지 알아내는 변수
    const pieceElement = $(this);
    const idx = parseInt(pieceElement.attr("data-id"));
    const pieceObj = pieces[idx];

    // 만약 해당 말이 한바퀴 돌았다면, 아무것도 안함
    if (pieceObj.finished) return;

    // 돌지 않은 말에는 클릭가능하게하고, 클릭하면 움직이게함 
    pieceElement.addClass("selectable").on("click", function () {
      movePiece(pieceObj, currentDice, currentTeam); 

      // 👌 콘솔에서 position 확인
      console.log(`${currentTeam}Pieces`, pieces); 

      // 윷이나 모 일때 룰
      if (currentDice === 4 || currentDice === 5) {
        setTimeout(() => {
          //❗ 주사위 던지기가 활성화되면서, 흔들리는 애니메이션도 넣기
          $("#throw").toggleClass("disabled"); 
        }, 1000);
      } else {
        // 윷이나 모가 아니라면?
        setTimeout(() => {
          //❗ 다음 턴으로 넘어가게하기
          currentTeamIndex = (currentTeamIndex + 1) % teams.length;
          alert("다음턴: " + teams[currentTeamIndex]);
          $("#throw").removeClass("disabled");
        }, 1000);
      }

      //❗ 만약, 해당칸에 내 팀 말이 있다면, 업고가기.
      //❗ 만약, 해당칸에 다른 팀 말이 있다면, 잡고 또 던지기
    });
  });
}

$("#throw").click(function () {
  const throwResult = [-1, 1, 2, 3, 4, 5];
  currentDice = throwResult[Math.floor(Math.random() * throwResult.length)];
  const resultText = getYutResult(currentDice);
  alert("주사위 결과: " + resultText + "\n현재 턴: " + teams[currentTeamIndex]);

  // 버튼 비활성화
  $("#throw").toggleClass("disabled"); // 주사위 던지기 비활성화

  const currentTeam = teams[currentTeamIndex];
  const pieces = teamPieces[currentTeam];
  const movable = pieces.some(p => !p.finished);

  if (!movable) {
    alert("움직일 말이 없습니다. 턴 넘깁니다.");
    currentTeamIndex = (currentTeamIndex + 1) % teams.length;
    $("#throw").toggleClass("disabled");
    return;
  }

  // 사용자에게 말 선택 유도
  pieceSelect();
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
