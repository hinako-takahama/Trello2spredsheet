var user = 'username';
var api_key = 'api_key';
var api_token = 'api_token';
var board_id = 'boad_id';
var c;

function saveTask(){
  clear();
  const sheet = SpreadsheetApp.getActiveSheet();
  var row = 1;
  var colum = 1;
  var namelist = getListsName();
  var cardlist = getCardsName();
  var cell_board = sheet.getRange(row, colum).setValue(getBoardsName());
  setBoardDesign(sheet,cell_board)
  for(var i=0; i<namelist.length; i++){
    var cell_list = sheet.getRange(row + 1, colum).setValue(namelist[i]);
    setListDesign(sheet, cell_list);
    colum = colum + 1;
    if(i === namelist.length - 1){
      colum = 1;
    }
  }

  for(var i=0; i<Object.keys(cardlist).length; i++){
    var obj = new maxSize();
    obj.setmaxSize(0);
    for(var j=0; j<Object.keys(cardlist[i]).length; j++){
      Logger.log(cardlist[i][j])
      var cell_card = sheet.getRange(row + 2, colum).setValue(cardlist[i][j]);
      setCardsDesign(sheet,cell_card,obj);
      row = row + 1;
      if(j === Object.keys(cardlist[i]).length - 1){
        row = 1;
      }
    }
    sheet.getColumnWidth(colum);
    colum = colum + 1;
  }
}

function getBoardsName() {
  var url = 'https://api.trello.com/1/members/' + user + '/boards?key=' + api_key + '&token=' + api_token + '&fields=name';
  var res = UrlFetchApp.fetch(url, {'method':'get'});
  var json = JSON.parse(res.getContentText());
  return json[2].name;
}

function getListsName() {
  var url = "https://trello.com/1/boards/" + board_id + "/lists?key=" + api_key + "&token=" + api_token + "&fields=name";
  var res = UrlFetchApp.fetch(url, {'method':'get'});
  var json = JSON.parse(res.getContentText());
  var namelist = [];
  for(var i = 0; i < json.length; i++){
    namelist.push(json[i].name);
  }
  return namelist;
}

function getCardsName() {
  var url = "https://trello.com/1/boards/" + board_id + "/lists?key=" + api_key + "&token=" + api_token + "&fields=name&cards=open&card_fields=name";
  var res = UrlFetchApp.fetch(url, {'method':'get'});
  var json = JSON.parse(res.getContentText());
  var cardlist = [];
  for(var i = 0; i < json.length; i++){
    var card = json[i].cards;
    var cardnum = json[i].cards.length;
    cardlist[i] = {};
    for(var j = 0; j < cardnum; j++){
      cardlist[i][j]=card[j].name;
    }
  }
 return cardlist;
}

function setBoardDesign(sheet,cell){
  var size = 11;

  cell.setFontSize(size);
  cell.setBackground('#0079BF');
  cell.setFontColor('#FFFFFF');
  cell.setFontWeight("bold");
}

function setListDesign(sheet,cell){
  var size = 10;
  var col = cell.getColumn();
  cell.setFontSize(size);
  cell.setBackground('#DFE3E6');
  cell.setFontColor('#000000');
  cell.setFontWeight("bold");
}

function setCardsDesign(sheet,cell,obj){
  var tempsize;
  var col = cell.getColumn();
  var row = cell.getRow();
  var size = 10;

  cell.setFontSize(size);
  cell.setBackground('#FFFFFF');
  cell.setFontColor('#000000');
  tempsize = sheet.getColumnWidth(col);

  if(obj.getmaxSize() <= tempsize){
    obj.setmaxSize(tempsize);
    sheet.setColumnWidth(col, obj.getmaxSize());
    Logger.log(col);
//    Logger.log(sheet.getColumnWidth(col))
  }
}

function maxSize() {
    var max;
    this.getmaxSize = function () {
        return max;
    };
    this.setmaxSize = function (val) {
        max = val;
    };
}

function clear(){
 var sheets = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = sheets.getActiveSheet();
 var obj = new maxSize();
 obj.setmaxSize(0);
 sheet.clear();
}
