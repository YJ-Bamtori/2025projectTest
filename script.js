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

// 2. 팀 생성
const teams = ['red', 'blue', 'mint', 'yellow'];

const TeamMaker = (team) =>
  [0, 1, 2].map((i) => ({
    idx: i,
    position: '0d',
    finished: false,
    route: ['main'],
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

const Yutnum = {
  빽도: [-1, '빽도'],
  도: [1, '도'],
  개: [2, '개'],
  걸: [3, '걸'],
  윷: [4, '윷'],
  모: [5, '모'],
};

// 2-1 팀 턴 바꾸기
function changeTurn() {
  const teamturn = ['redturn', 'blueturn', 'mintturn', 'yellowturn'];
  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  $('#throw').addClass('disabled');
  $('#throw').attr('disabled', false);
  alert(teams[currentTeamIndex] + ' 팀의 턴입니다.');
  teamturn.forEach((turnId, index) => {
    if (index !== currentTeamIndex) {
      $(`#${turnId}`).css('opacity', 0);
    } else {
      $(`#${turnId}`).css('opacity', 1);
    }
  });
}

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

let currentTeamIndex = 0;
let currentDiceNum = 0;
const currentDiceHistoryId = [];
const currentDiceHistory = [];

$('#throw').click(function () {
  handleDiceRoll();
  updateHistoryDisplay();
  enablePieceSelection();
});

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
    $('#throw').attr('disabled', true);
    $('#throw').html('주사위 던지기');
    alert('말을 옮겨주세요');
  } else {
    $('#throw').html('또 던지기');
    alert('한번더!');
  }
}

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

      // 🔴
      updateHistoryDisplay();
      movePiece(removehistory, currentTeam, currentselectedPiece);

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

  $(pieceSelector).appendTo(`#${afterPosId}`);

  // 빽도 아닐 때, 루트 업데이트
  if (removehistory !== '빽도') {
    updatePath(afterPosId, routePath, currentTeam, currentselectedPiece);
  }

  // 전역 teaminfo 업데이트
  teamInfo[currentTeam][currentselectedPiece].position = afterPosId;
}

function updatePath(afterPosId, routePath, currentTeam, currentselectedPiece) {
  if (afterPosId === '5d' && routePath !== 'shortcut_5') {
    teamInfo[currentTeam][currentselectedPiece].route.push('shortcut_5');
  } else if (afterPosId === '10d' && routePath !== 'shortcut_10') {
    teamInfo[currentTeam][currentselectedPiece].route.push('shortcut_10');
  } else if (afterPosId === 'center' && routePath !== 'shortcut_center') {
    teamInfo[currentTeam][currentselectedPiece].route.push('shortcut_center');
  } else {
    console.log('경로 변경 없음');
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

// 해야할 일,
// 1. 도착했을때 로직 : 현재 루트의 index를 넘어가면 도착 -> 도착하면 finish = true, appendto, 클릭 불가능한 상태로 변경.
// 2. 말을 잡았을 때 로직 : 말을 잡으면, 던지기 버튼 활성화.
// 3. 말을 업었을 때 로직 : 한개로 같이 이동  
// 4. 순위 로직 : finish갯수, 도착지까지 남은 거리 순으로, 동점인 경우 ->  red,blue,mint,yellow 순으로
// 5. 미션 로직 : x
// 6. 빽도 도착 로직 : '0d'에서 뺵도가 나오지 않으면 finish, '0d'에서 빽도가 나오면 '1d'로 이동
// 7. 게임 종료 로직 : finish 말을 3개 가진 팀이 3개 나오면, 끝
