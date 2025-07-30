const routes = {
  main: [
    '0d',
    '1d',
    '2d',
    '3d',
    '4d',
    '5d',
    '6d',
    '7d',
    '8d',
    '9d',
    '10d',
    '11d',
    '12d',
    '13d',
    '14d',
    '15d',
    '16d',
    '17d',
    '18d',
    '19d',
    '20d',
  ],
  shortcut_5: [
    '5d',
    '5_1d',
    '5_2d',
    'center',
    '5_3d',
    '5_4d',
    '15d',
    '16d',
    '17d',
    '18d',
    '19d',
    '20d',
  ],
  shortcut_10: [
    '10d',
    '10_1d',
    '10_2d',
    'center',
    'center_1d',
    'center_2d',
    '20d',
  ],
  shortcut_center: ['center', 'center_1d', 'center_2d', '20d'],
};

// 팀 생성
const teams = ['red', 'blue', 'mint', 'yellow'];

const TeamMaker = (team) =>
  [0, 1, 2].map((i) => ({
    idx: i,
    position: '0d',
    finished: false,
    route: ['main'],
    carries: [],
  }));

const teamInfo = {
  red: TeamMaker('red'),
  blue: TeamMaker('blue'),
  mint: TeamMaker('mint'),
  yellow: TeamMaker('yellow'),
};

const teamBox = {
  red: 'redBox',
  blue: 'blueBox',
  mint: 'mintBox',
  yellow: 'yellowBox',
};

// 윷 결과 정의
const Yutnum = {
  빽도: [-1, '빽도'],
  도: [1, '도'],
  개: [2, '개'],
  걸: [3, '걸'],
  윷: [4, '윷'],
  모: [5, '모'],
};

// 팀 스코어
const teamScore = {
  red: {
    finished: 0,
  },
  blue: {
    finished: 0,
  },
  mint: {
    finished: 0,
  },
  yellow: {
    finished: 0,
  },
};

//랜덤 뽑기
function getYutResult(num) {
  switch (num) {
    case -1:
      return Yutnum.빽도[1];
    case 1:
      return Yutnum.도[1];
    case 2:
      return Yutnum.개[1];
    case 3:
      return Yutnum.걸[1];
    case 4:
      return Yutnum.윷[1];
    case 5:
      return Yutnum.모[1];
    default:
      return num;
  }
}

// 팀 순서, 현재 주사위, 주사위 히스토리
let currentTeamIndex = 0;
let currentDiceNum = 0;
let currentDiceHistoryId = [];
let currentDiceHistory = [];

// 팀 턴 바꾸기
function changeTurn() {
  const teamturn = ['redturn', 'blueturn', 'mintturn', 'yellowturn'];
  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  $('#throw').addClass('disabled'); // 턴이 변경되는 동안 클릭을 막음
  $('#throw').attr('disabled', false);
  alert(teams[currentTeamIndex] + ' 팀의 턴입니다.');
  teamturn.forEach((turnId, index) => {
    if (index !== currentTeamIndex) {
      $(`#${turnId}`).css('opacity', 0);
    } else {
      $(`#${turnId}`).css('opacity', 1);
    }
  });

  // 🔴만약 현재 팀의 말이 모두 도착했다면, 턴을 건너뛰고 다음 팀으로 넘어감
  const currentTeam = teams[currentTeamIndex];
  const allFinished = teamInfo[currentTeam].every((piece) => piece.finished);
  if (allFinished) {
    alert(
      `${currentTeam} 팀의 모든 말이 도착했습니다. 다음 팀으로 넘어갑니다.`
    );
    changeTurn(); // 다음 팀으로 넘어감
  }
}

// ✔️던지기
$('#throw').click(function () {
  handleDiceRoll();
  updateHistoryDisplay();
  enablePieceSelection();
});

// ✔️던지기 - 주사위 결과 확인
function handleDiceRoll() {
  let throwDice = parseInt(
    prompt(
      '원하는 윷 결과를 입력하세요 (-1:빽도, 1:도, 2:개, 3:걸, 4:윷, 5:모)'
    )
  );
  currentDiceNum = throwDice;
  const currentDice = getYutResult(throwDice);
  alert('주사위 결과: ' + currentDice);

  currentDiceHistory.push(currentDiceNum);
  currentDiceHistoryId.push(currentDice);

  if (currentDice !== '윷' && currentDice !== '모') {
    $('#throw').addClass('disabled');
    $('#throw').attr('disabled', true); // ???
    $('#throw').html('주사위 던지기');
    alert('말을 옮겨주세요');
  } else {
    $('#throw').html('또 던지기');
    alert('한번더!');
  }
}

// ✔️던지기 - 주사위 결과 확인 - 히스토리 업데이트
function updateHistoryDisplay() {
  const numOfhistory = {
    numback: currentDiceHistoryId.filter((i) => i === '빽도').length,
    numdo: currentDiceHistoryId.filter((i) => i === '도').length,
    numgae: currentDiceHistoryId.filter((i) => i === '개').length,
    numgirl: currentDiceHistoryId.filter((i) => i === '걸').length,
    numyut: currentDiceHistoryId.filter((i) => i === '윷').length,
    nummo: currentDiceHistoryId.filter((i) => i === '모').length,
  };

  if (numOfhistory.numback === 0) $('#back').hide();
  if (numOfhistory.numdo === 0) $('#do').hide();
  if (numOfhistory.numgae === 0) $('#gae').hide();
  if (numOfhistory.numgirl === 0) $('#girl').hide();
  if (numOfhistory.numyut === 0) $('#yut').hide();
  if (numOfhistory.nummo === 0) $('#mo').hide();

  $('#back .double h2')
    .attr('data-content', numOfhistory.numback)
    .text(numOfhistory.numback);
  $('#do .double h2')
    .attr('data-content', numOfhistory.numdo)
    .text(numOfhistory.numdo);
  $('#gae .double h2')
    .attr('data-content', numOfhistory.numgae)
    .text(numOfhistory.numgae);
  $('#girl .double h2')
    .attr('data-content', numOfhistory.numgirl)
    .text(numOfhistory.numgirl);
  $('#yut .double h2')
    .attr('data-content', numOfhistory.numyut)
    .text(numOfhistory.numyut);
  $('#mo .double h2')
    .attr('data-content', numOfhistory.nummo)
    .text(numOfhistory.nummo);

  ['back', 'do', 'gae', 'girl', 'yut', 'mo'].forEach((id) => {
    const label = {
      back: '빽도',
      do: '도',
      gae: '개',
      girl: '걸',
      yut: '윷',
      mo: '모',
    }[id];
    if (currentDiceHistoryId.includes(label)) {
      $(`#${id}`).css('display', 'flex');
    }
  });
}

// ✔️던지기 - 주사위 결과 확인 - 히스토리 업데이트 - ♟️말 비활/활성화
function enablePieceSelection() {
  const currentTeam = teams[currentTeamIndex];
  const teamId = teamBox[currentTeam];
  if (currentDiceHistory.length > 0) {
    $(`.${teamId}`).css('pointer-events', 'auto');
    $(`.${teamId}`).addClass('selectable');
    handlePieceClick(currentTeam, teamId);
  } else {
    $(`.${teamId}`).removeClass('selectable');
  }
}

//♟️말 비활/활성화 -  말 선택
function handlePieceClick(currentTeam, teamId) {
  let currentselectedPiece = null;

  $(`.${teamId}`)
    .off('click')
    .on('click', function () {
      const pieceIdx = $(this).attr('data-id');
      currentselectedPiece = pieceIdx;

      $(`.${teamId}`).removeClass('selectable').css('pointer-events', 'none');
      $(`#${currentTeam}_return`).show();
      $('#throw').hide();

      $('.history_red, .history_blue')
        .addClass('selectable')
        .css('pointer-events', 'auto');

      setupHistoryClick(currentTeam, teamId, currentselectedPiece);
      setupReturnButton(teamId);
    });
}

// 🗨️히스토리 클릭
function setupHistoryClick(currentTeam, teamId, currentselectedPiece) {
  $('.history_blue, .history_red')
    .off('click')
    .on('click', function (e) {
      const $target = $(e.target).closest('.history_blue, .history_red');
      const removehistory = $target.data('result');
      const idxToRemove = currentDiceHistoryId.indexOf(removehistory);
      const currentPath = teamInfo[currentTeam][currentselectedPiece].position;

      // 히스토리에서 제거
      if (idxToRemove > -1) {
        currentDiceHistoryId.splice(idxToRemove, 1);
      }

      $('.history_blue, .history_red')
        .removeClass('selectable')
        .css('pointer-events', 'none');
      $('#throw').show();
      $('.return').hide();

      updateHistoryDisplay();
      movePiece(removehistory, currentTeam, currentselectedPiece);

      if (teamScore[currentTeam].finished >= 3) {
        currentDiceHistoryId.length = [];
        currentDiceHistory = [];
        updateHistoryDisplay();

        $(`.${teamId}`).removeClass('selectable').css('pointer-events', 'none');
        $('#throw')
          .addClass('disabled')
          .attr('disabled', true)
          .html('주사위 던지기');
      }

      if (currentDiceHistoryId.length > 0) {
        $(`.${teamId}`).addClass('selectable').css('pointer-events', 'auto');
      } else {
        $(`.${teamId}`).removeClass('selectable').css('pointer-events', 'none');
        if ($('#throw').hasClass('disabled')) {
          changeTurn();
          $('#throw')
            .removeClass('disabled')
            .attr('disabled', false)
            .html('주사위 던지기');
          alert('다음턴');
        }
      }
    });
}

function setupReturnButton(teamId) {
  $('.return')
    .off('click')
    .on('click', function () {
      $('.return').hide();
      $(`.${teamId}`).addClass('selectable').css('pointer-events', 'auto');
      $('.history_blue, .history_red').off('click').removeClass('selectable');
      $('#throw').show();
    });
}

function movePiece(removehistory, currentTeam, currentselectedPiece) {
  let route = teamInfo[currentTeam][currentselectedPiece].route; //선택한 말의 현재 루트
  let currentRoute = route[route.length - 1]; // 현재 루트 이름
  let routePath = routes[currentRoute]; // 선택한 말의 루트 패스

  let currentPosId = teamInfo[currentTeam][currentselectedPiece].position; // 현재 위치 ID
  let currentPosIndex = routePath.indexOf(currentPosId); // 현재 위치 인덱스

  // 빽도 일때, 루트 업데이트
  if (removehistory === '빽도') {
    backupdatePath(
      currentPosId,
      currentRoute,
      currentTeam,
      currentselectedPiece
    );
    const newCurrentRoute =
      teamInfo[currentTeam][currentselectedPiece].route.at(-1);

    routePath = routes[newCurrentRoute];
    currentPosIndex = routePath.indexOf(currentPosId); // -> 5
  }

  let afterPosIndex = currentPosIndex + Yutnum[removehistory][0]; // 이동 후 위치 인덱스
  let afterPosId = routePath[afterPosIndex]; // 이동 후 위치 ID
  let pieceSelector = `.${teamBox[currentTeam]}[data-id="${currentselectedPiece}"]`; //나의 말 선택자

  pieceObserver(afterPosId, pieceSelector, currentTeam);

  $(pieceSelector).appendTo(`#${afterPosId}`);

  // 🔴 말 함께 이동 - 말이 함께 도착했을때, 난리남
  const carriedPieces = teamInfo[currentTeam][currentselectedPiece].carries;

  carriedPieces.forEach((carriedId) => {
    const carriedSelector = `.${teamBox[currentTeam]}[data-id="${carriedId}"]`;
    teamInfo[currentTeam][carriedId].position = afterPosId;
    $(carriedSelector).appendTo(`#${afterPosId}`);
  });

  // 빽도 아닐 때, 루트 업데이트
  if (removehistory !== '빽도') {
    updatePath(afterPosId, routePath, currentTeam, currentselectedPiece);
  }

  // 전역 teaminfo 업데이트
  teamInfo[currentTeam][currentselectedPiece].position = afterPosId;

  // 도착 로직
  if (afterPosIndex >= routePath.length) {
    teamInfo[currentTeam][currentselectedPiece].finished = true;
    teamInfo[currentTeam][
      currentselectedPiece
    ].position = `${teamInfo[currentTeam][currentselectedPiece].idx} ${currentTeam}`;

    $(pieceSelector).addClass('finished');
    $(pieceSelector).off('click'); // 클릭 불가능하게
    $(pieceSelector).css('display', 'none');

    alert(`${currentTeam} 팀의 ${currentselectedPiece}번 말이 도착했습니다!`);
  }

  console.log(teamInfo);
  calculateRankings(); //순위 업데이트
  finishGame();
}

function pieceObserver(afterPosId, pieceSelector, currentTeam) {
  for (const team of teams) {
    const pieces = teamInfo[team];
    const foundPiece = pieces.find(
      (piece) =>
        piece.position === afterPosId &&
        !Object.values(teamInfo).some((teamPieces) =>
          teamPieces.some((p) => p.carries.includes(piece.idx))
        )
    );
    // console.log(foundPiece); // foundPiece는 해당말의 teaminfo를 보여줌.

    if (foundPiece) {
      // 1. 우리 팀이면 -> 업기
      if (team === currentTeam) {
        const pieceId = parseInt($(pieceSelector).attr('data-id')); //업힌 2번 말의 "idx"문자열
        const carriedPieceId = foundPiece.idx; // 업혀진 1번 말의 "idx"숫자

        teamInfo[currentTeam][carriedPieceId].carries.push(pieceId);
        //🔴문제! : 업은 경우 우리팀 두명 다 선택이 가능한 상태가 되어버림. 해당 형태는 디자인해야함

        $(pieceSelector).hide();
        // 1번말의 carries.length의 숫자가 나타나게하기
      }
      // 2. 상대 팀이면
      else {
        const enemyPieceId = foundPiece.idx;

        //2-1 만약 업고 있는 상대 팀이라면?
        if (foundPiece.carries.length > 0) {
          console.log('많이잡음');
          foundPiece.carries.forEach((carriedId) => {
            teamInfo[team][carriedId].position = '0d';
            teamInfo[team][carriedId].route = ['main'];
            teamInfo[team][carriedId].carries = [];
            $(`.${teamBox[team]}[data-id="${carriedId}"]`).css(
              'display',
              'flex'
            );

            $(`.${teamBox[team]}[data-id="${carriedId}"]`).appendTo(
              `#${teamBox[team]}${carriedId}`
            );
          });
        }

        teamInfo[team][enemyPieceId].position = '0d';
        teamInfo[team][enemyPieceId].route = ['main'];
        teamInfo[team][enemyPieceId].carries = [];

        $(`.${teamBox[team]}[data-id="${enemyPieceId}"]`).appendTo(
          `#${teamBox[team]}${enemyPieceId}`
        );

        // 3. 다시 던지기
        $('#throw').removeClass('disabled');
        $('#throw').attr('disabled', false);
      }
      break;
    }
  }
}

function updatePath(afterPosId, routePath, currentTeam, currentselectedPiece) {
  if (afterPosId === '5d' && routePath !== 'shortcut_5') {
    teamInfo[currentTeam][currentselectedPiece].route.push('shortcut_5');
  } else if (afterPosId === '10d' && routePath !== 'shortcut_10') {
    teamInfo[currentTeam][currentselectedPiece].route.push('shortcut_10');
  } else if (afterPosId === 'center' && routePath !== 'shortcut_center') {
    teamInfo[currentTeam][currentselectedPiece].route.push('shortcut_center');
  } else {
    return;
  }
}

function backupdatePath(
  currentPosId,
  currentRoute,
  currentTeam,
  currentselectedPiece
) {
  if (currentPosId === '5d' && currentRoute == 'shortcut_5') {
    teamInfo[currentTeam][currentselectedPiece].route.pop();
  } else if (currentPosId === '10d' && currentRoute == 'shortcut_10') {
    teamInfo[currentTeam][currentselectedPiece].route.pop();
  } else if (currentPosId === 'center' && currentRoute == 'shortcut_center') {
    teamInfo[currentTeam][currentselectedPiece].route.pop();
  } else {
    console.log('경로 변경 없음');
  }
}

function calculateRankings() {
  const teamNames = ['red', 'blue', 'mint', 'yellow'];

  const rankTeamData = teamNames.map((team) => {
    const pieces = teamInfo[team];

    // 현재 루트 및 위치를 기반으로 남은 거리 계산
    const remains = pieces.map((piece) => {
      if (piece.finished) return 0;
      const currentRoute = piece.route.at(-1); // 마지막 경로
      const routePath = routes[currentRoute];
      const currentIndex = routePath.indexOf(piece.position);
      return routePath.length - currentIndex - 1;
    });

    const totalRemain = remains.reduce((acc, curr) => acc + curr, 0);
    const finishCount = pieces.filter((piece) => piece.finished).length;

    return {
      team,
      finishCount,
      totalRemain,
    };
  });

  rankTeamData.sort((a, b) => {
    if (b.finishCount !== a.finishCount) {
      return b.finishCount - a.finishCount; // finish 많은 팀이 앞
    } else if (a.totalRemain !== b.totalRemain) {
      return a.totalRemain - b.totalRemain; // 남은 거리 적은 팀이 앞
    } else {
      return teamNames.indexOf(a.team) - teamNames.indexOf(b.team); // 우선순위 team 배열 기준
    }
  });

  // console.log(rankTeamData); 랭킹

  rankTeamData.forEach((teamData, i) => {
    const rankText = `${i + 1}등`;
    $(`#rank${teamData.team}`).text(rankText);
  });
}
// // 5-1. 미션 카드 얻는 조건 : 해당 위치를 지나가면, 미션카드 획득.
// 5-2. 랜덤 생성 조건 : 미션카드는 퀴즈형.
// 5-3. 퀴즈형 : 퀴즈형인 경우 선택 문제 생성.
// 5-4. 보상 : 상대말을 공격하거나, 내 말에게 도움이 되는 기능
// 5-5. 벌칙 : 당장 내 말에게 불이익을 줌.
// 5-6. 미션카드 밸런스생각하기

// 6-1. 만약 내 position이 0d이고, 내말이 #0d에 appendTo 되어있을 때, 빽도가 나오지 않으면 도착,
// 6-2. 빽도가 나왔다면 다시 1d로 이동.

// 7-1. finish인 말이 3개인 팀 3개가 나오면 게임 종료.

function finishGame() {
  teams.forEach((team) => {
    const finishedCount = teamInfo[team].filter(
      (piece) => piece.finished
    ).length;
    teamScore[team].finished = finishedCount;
  });

  const teamsWith3Finished = Object.keys(teamScore).filter(
    (team) => teamScore[team].finished >= 3
  );

  // 3. 3개 팀 이상이면 게임 종료
  if (teamsWith3Finished.length >= 3) {
    alert(`게임 종료! 승리한 팀: ${teamsWith3Finished.join(', ')}`);
  }
  // 🔴이거 이상한거같기도하고 아닌거같기도하고.
}

// function createMissionCard() {
//   const tiles = document.querySelectorAll('.tile.corner, .tile.normal');
//   const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
//   const missionCard = document.createElement('img');

//   missionCard.src = 'mission.png';
//   missionCard.className = 'mission';
//   missionCard.style.position = 'absolute';

//   // 타일의 위치를 기준으로 mission 배치
//   const tileRect = randomTile.getBoundingClientRect();
//   const boardRect = document.querySelector('.board').getBoundingClientRect();

//   missionCard.style.top = `${tileRect.top - boardRect.top}px`;
//   missionCard.style.left = `${tileRect.left - boardRect.left}px`;

//   document.querySelector('.board').appendChild(missionCard);
// }

// 호출 예시
createMissionCard();

// 해야할 일,
// clear. 도착했을때 로직 : 현재 루트의 index를 넘어가면 도착 -> 도착하면 finish = true, appendto, 클릭 불가능한 상태로 변경.
// clear. 말을 잡았을 때 로직 : 말을 잡으면, 던지기 버튼 활성화.
// clear. 말을 업었을 때 로직 : 한개로 같이 이동
// clear. 순위 로직 : finish갯수, 도착지까지 남은 거리 순으로, 동점인 경우 ->  red,blue,mint,yellow 순으로
// 5. 미션 로직 : 조건(?)이 충족되면, 내 다음 턴에 미션카드 랜덤 위치에 생성.
// 6. 빽도 도착 로직 : '0d'에서 뺵도가 나오지 않으면 finish, '0d'에서 빽도가 나오면 '1d'로 이동
// clear. 게임 종료 로직 : finish 말을 3개 가진 팀이 3개 나오면, 끝
// clear. 내 차례에서(순서가 변경되었을 시점에), 움직일 말이 없으면, 차례 이동
// clear. 내가 움직일 말이 없으면 (히스토리에 남은게 있게 되면 차례를 바꿀수 없음.), 자동으로 차례 이동
// new 9. 내 손에 있는 말은 빽도 선택 했을 시, 움직임 불 가능
// new 10. 업었을때, 업힌말은 선택이 불가능하게 해야함...
