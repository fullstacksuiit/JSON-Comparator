onClick = () => {
  let jsona = document.getElementById("json_a").value;
  let jsonb = document.getElementById("json_b").value;
  try{
    let differ = comparejson(JSON.parse(jsona), JSON.parse(jsonb));
    if(Object.keys(differ).length === 0){
      shownoti('primary', 'All Match!!');
    }
    else{
      shownoti('none', 'none');
    }
    let table = document.getElementById("table");
    clearTable(table);
    for(let d in differ){
      insert(table, d, differ[d].nodea, differ[d].nodeb);
    }
  }
  catch(e){
    shownoti('danger', 'Error: ' + e);
  }
}

onClickMerge = () => {
  let jsona = document.getElementById("json_a").value;
  let jsonb = document.getElementById("json_b").value;
  try{
    let differ = mergejson(JSON.parse(jsona), JSON.parse(jsonb));
    if(Object.keys(differ).length === 0){
      shownoti('primary', 'All Match!!');
    }
    else{
      shownoti('none', 'none');
    }
    document.getElementById("json_merge").value = JSON.stringify(differ);
  }
  catch(e){
    shownoti('danger', 'Error: ' + e);
  }
}

shownoti = (status, text) => {
  let noti = document.getElementById("noti");
  noti.classList.remove("is-primary");
  noti.classList.remove("is-danger");

  if(status == 'none'){
    noti.style.display = 'none';
  }
  else{
    noti.style.display = 'block';
    console.log("is-" + status);
    noti.classList.add("is-" + status);
    noti.innerHTML = text;
  }
}

insert = (t, path, a, b) => {
  let r = t.insertRow(1);
  r.insertCell(0).innerHTML = path;
  r.insertCell(1).innerHTML =  a? a: '-';
  r.insertCell(2).innerHTML = b? b: '-';
}

clearTable = (t) => {
  for(let i = t.rows.length-1; i > 0; i--){
    t.deleteRow(i);
  }
}

comparejson = (jsona, jsonb) => {

  var diff = {};

  compareIter = (nodea, nodeb, path, pos) => {
    if(typeof(nodea)=='object'){
      for(let child in nodea){
        compareIter(getChild(nodea, child),getChild(nodeb, child), path + child + '/', pos);
      }
    }
    else{
      if(nodea != nodeb){
        if(pos){ diff[path] = {'nodea' : nodea, 'nodeb': nodeb} }
        else{ diff[path] = {'nodea': nodeb, 'nodeb' : nodea} }
      }
    }
  }

  getChild = (p, k) => {return typeof(p)=='object'? p[k]: undefined}

  compareIter(jsona, jsonb, '', true);
  compareIter(jsonb, jsona, '', false);
  return diff;
}

mergejson = (jsona, jsonb) => {
  var diff = {};

  combineObjs = (obj, target) => {
    for (let key of Object.keys(obj)) {
      console.log(obj[key].toString(), typeof(obj[key]));
      if (typeof obj[key] === 'object') {
        console.log("thinks object")
        if (!target[key]) {
          target[key] = {};
        }
        combineObjs(obj[key], target[key]);
      }
      else {
        if (target[key]) {
          target[key + "_1"] = obj[key];
        }
        else {
          target[key] = obj[key];
        }
      }
    }
  }

  combineObjs(jsona, diff);
  combineObjs(jsonb, diff);
  return diff;
}
