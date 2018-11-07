const initial = [ "Airport #1", "Airport #2", "Airport #3", "Airport #4",
"Airport #5" ];
var urls = [];

var cols = 3;
const PAD = 45;
const KEY_ESC = 27;
const KEY_U = 38;
const KEY_D = 40;
const KEY_L = 37;
const KEY_R = 39;
const HEIGHT = 1920;
const WIDTH = 1080;
const hourBump = 1800000;
const dayBump = 86400000;
const startDate = new Date(2018, 10, 11, 7, 30, 0, 0);
const endDate = new Date(2018, 10, 16, 15, 0, 0, 0);
var curDate = new Date(Math.max(startDate.getTime(), new Date().getTime()));

$(() => {
  $(window).resize(scale);
  $(window).keydown(onKeyDown);
  $("#less").click(() => { cols--; scale(); });
  $("#more").click(() => { cols++; scale(); });
  $("#add").click(onAddClick);
  $("#addUrl").bind('submit', onAddSubmit);

  for (var i of initial) {
    urls.push(feeds.find(feed => feed.room === i).url);
  }
  buildGrid();
});

function buildGrid() {
  $("#grid div").remove();
  for (let i = 0; i < urls.length; i++) {
    addDiv(i);
  }
  loadContent();
}

function fmtDate(d) {
  return "&testing=1" + "&date=2018-11-" + `${d.getDate()}`.padStart(2, 0) +
         "&time=" + `${d.getHours()}`.padStart(2, 0) + "-" +
         `${d.getMinutes()}`.padStart(2, 0);
}

function scale() {
  $("#grid").css("grid-template-columns", "fit-content(1px) ".repeat(cols));
  const factor = Math.min(
    $(window).height()/((HEIGHT+30) * Math.ceil(urls.length/cols)),
    $(window).width()/((WIDTH+35) * cols)
  );
  $("#grid").css("transform", "scale(" + factor + ")");
}

function addDiv(_which) {
  let which = _which !== undefined ? _which : urls.length-1;
  let div = $("<div />",
    {
      id: "box-" + which,
      class: "box",
    }
  ).append(
    $("<iframe>", { id: "frame-" + which } )
      .css( { width: WIDTH, height: HEIGHT} )
  );
  $("#grid").append(div);
  scale();
  loadContent();
}

function onKeyDown(e) {
  switch(e.which) {
    case KEY_U:
      curDate = new Date(curDate.getTime() + dayBump);
    break;

    case KEY_D:
      curDate = new Date(curDate.getTime() - dayBump);
    break;

    case KEY_L:
      curDate = new Date(curDate.getTime() - hourBump);
    break;

    case KEY_R:
      curDate = new Date(curDate.getTime() + hourBump);
    break;

    case KEY_ESC:
      $("#getURL").css("display", "none");
      return;
    break;

    default:
    return;
  }
  loadContent();
}

function makeCheckbox(feed) {
  return $("<input>", {
      type: "checkbox",
      checked: urls.find(url => url === feed.url) !== undefined
    })
    .click(function () {
      if ($(this).attr("checked") === undefined) {
        $(this).attr("checked", 1);
        urls.push(feed.url);
        addDiv();
      } else {
        $(this).attr("checked", undefined);
        urls = urls.filter(u => u !== feed.url);
        buildGrid();
      }
    });
}

function makeLink(feed) {
  return $("<a>").text(feed.url).click(() => $("#new-url").val(feed.url));
}

function makeAddLink(feed) {
  return $("<div>").append(makeCheckbox(feed))
                   .append(" " + feed.room + " (" + feed.dates + ") ")
                   .append(makeLink(feed));
}

function onAddClick(e) {
  $("#new-url").css("width", feeds[0].url.length + "ch");
  let list = $("<ul>");
  for (var i of feeds) {
    list.append($("<li>").append(makeAddLink(i)));
  }
  $("#options").empty().append(list);
  $("#getURL").css("display", "block");
}

function onAddSubmit(e) {
  $("#getURL").css("display", "none");
  let newUrl = $("#new-url").val();
  if (newUrl === "") return false;

  $("#new-url").val("");

  urls.push(newUrl);
  addDiv();
  //console.log(newUrl);
  loadContent();

  return false;
}

function loadContent() {
  $("iframe").each(function() {
    let index = $(this).attr("id").split('-')[1];
    if (!index) return;
    let url = urls[parseInt(index)];
    url += fmtDate(curDate);
    $(this).prop("src", url);
  });
}
