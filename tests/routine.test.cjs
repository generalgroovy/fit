const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const {createStore, STORAGE_KEY}=require('../routine-model.js');
const catalogue=['push-up','side-plank','goblet-squat'];
function memory(value){const data=new Map(value===undefined?[]:[[STORAGE_KEY,value]]);return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}

test('suggestions are not saved until a deliberate routine edit',()=>{
  const storage=memory(), store=createStore(catalogue,storage);
  assert.equal(store.current(),null);
  assert.equal(storage.getItem(STORAGE_KEY),null);
  store.add('push-up');
  assert.deepEqual(store.current(),['push-up']);
  assert.deepEqual(createStore(catalogue,storage).current(),['push-up']);
  store.undo();
  assert.equal(store.current(),null);
  assert.equal(storage.getItem(STORAGE_KEY),null);
});
test('add, reorder, remove, clear and replacement are individually reversible',()=>{
  const store=createStore(catalogue,memory());
  store.add('push-up'); store.add('side-plank'); store.move('side-plank',-1);
  assert.deepEqual(store.current(),['side-plank','push-up']);
  store.undo();assert.deepEqual(store.current(),['push-up','side-plank']);
  store.remove('push-up');assert.deepEqual(store.current(),['side-plank']);
  store.undo();assert.deepEqual(store.current(),['push-up','side-plank']);
  store.clear();assert.deepEqual(store.current(),[]);
  store.undo();assert.deepEqual(store.current(),['push-up','side-plank']);
  store.replace(['goblet-squat']);assert.deepEqual(store.current(),['goblet-squat']);
  store.undo();assert.deepEqual(store.current(),['push-up','side-plank']);
});
test('invalid, repeated and boundary actions never corrupt order or consume undo',()=>{
  const store=createStore(catalogue,memory());
  store.add('push-up');
  for(const mutate of [()=>store.add('evil'),()=>store.add('push-up'),()=>store.move('push-up',-1),()=>store.move('push-up',1),()=>store.move('push-up',2),()=>store.remove('missing')]) assert.equal(mutate(),false);
  const snapshot=store.current(); snapshot.push('evil');
  assert.deepEqual(store.current(),['push-up']);
  assert.throws(()=>store.replace('not an array'));
  store.undo(); assert.equal(store.current(),null); assert.equal(store.canUndo(),false);
});
test('empty routine persists distinctly from generated suggestions',()=>{
  const storage=memory(), store=createStore(catalogue,storage);
  store.clear(); assert.deepEqual(createStore(catalogue,storage).current(),[]);
});
test('malformed and future saves remain untouched until a deliberate edit',()=>{
  for(const raw of ['{','null','[]',JSON.stringify({version:2,ids:['push-up']}),JSON.stringify({version:1,ids:[null]}),JSON.stringify({version:1,ids:'push-up'})]) {
    const storage=memory(raw), store=createStore(catalogue,storage);
    assert.equal(store.current(),null); assert.match(store.message(),/could not be read/); assert.equal(storage.getItem(STORAGE_KEY),raw);
    store.add('push-up'); assert.deepEqual(createStore(catalogue,storage).current(),['push-up']);
  }
});
test('retired and repeated catalogue identities are safely removed from restored data',()=>{
  const store=createStore(catalogue,memory(JSON.stringify({version:1,ids:['push-up','removed','push-up','another-retired-exercise']})));
  assert.deepEqual(store.current(),['push-up']); assert.match(store.message(),/removed/);
});
test('denied or full storage retains editable, undoable state for manual export',()=>{
  for(const storage of [undefined,{getItem(){throw Error('denied');},setItem(){throw Error('quota');},removeItem(){throw Error('denied');}}]) {
    const store=createStore(catalogue,storage);
    store.add('push-up');store.add('side-plank');store.move('side-plank',-1);
    assert.deepEqual(store.current(),['side-plank','push-up']);assert.match(store.message(),/Copy or print/);
    store.undo();assert.deepEqual(store.current(),['push-up','side-plank']);
  }
});
test('kept routine rendering remains independent of changed filters and empty suggestions',()=>{
  const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const elements=new Map();
  const q=selector=>{if(!elements.has(selector))elements.set(selector,{textContent:'',innerHTML:'',setAttribute(){},addEventListener(){}});return elements.get(selector);};
  const context=vm.createContext({q,qa:()=>[],RoutineModel:require('../routine-model.js'),storage:memory()});
  vm.runInContext(script.slice(0,script.indexOf('const q =')),context);
  vm.runInContext(script.slice(script.indexOf('function updateAll('),script.indexOf('function modeTitle(')),context);
  vm.runInContext(`routineStore=RoutineModel.createStore(EXERCISES.map(e=>e.id),storage);routineStore.replace(['push-up','side-plank']);
    function currentList(){return [];};function generateRoutine(){return [];};function routineCoverage(){return [];};
    function modeTitle(){return '';};function activeModeHint(){return '';};function renderSelectedChips(){return '';};
    function renderRoutine(){return '';};function renderExercises(){return '';};function renderSources(){return '';};
    function updateBodyClasses(){};function updateBrowseContext(){};function copyRoutineText(){};function printRoutine(){};updateAll();`,context);
  assert.deepEqual(Array.from(vm.runInContext('lastRoutine.map(e=>e.id)',context)),['push-up','side-plank']);
  assert.equal(vm.runInContext('lastSuggestions.length',context),0);
});
test('coverage counts each selected group once and separates primary from secondary relationships',()=>{
  const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
  const context=vm.createContext({});
  vm.runInContext(html.slice(html.indexOf('function routineCoverage('),html.indexOf('function renderCoverage(')),context);
  const result=vm.runInContext(`routineCoverage([{primary:['chest'],secondary:['arms','chest']},{primary:['arms'],secondary:[]}],new Set(['chest','arms','legs']))`,context);
  assert.equal(result[0].primary.length,1);assert.equal(result[0].secondary.length,0);
  assert.equal(result[1].primary.length,1);assert.equal(result[1].secondary.length,1);
  assert.equal(result[2].primary.length+result[2].secondary.length,0);
});
test('copy and print use kept order and instructions even when current muscle filters differ',async()=>{
  const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  let copied='',printed=0;const output={innerHTML:''};
  const context=vm.createContext({navigator:{clipboard:{async writeText(value){copied=value;}}},flashCopy(){},q:()=>output,window:{print(){printed++;}}});
  vm.runInContext(script.slice(0,script.indexOf('const q =')),context);
  vm.runInContext(script.slice(script.indexOf('function setText('),script.indexOf('function renderExercises(')),context);
  vm.runInContext(script.slice(script.indexOf('function printRoutine('),script.indexOf('function renderSources(')),context);
  vm.runInContext(script.slice(script.indexOf('async function copyRoutineText'),script.indexOf('function flashCopy')),context);
  vm.runInContext(script.slice(script.indexOf('function escapeHtml('),script.indexOf("q('#atlasView').addEventListener")),context);
  vm.runInContext("lastRoutine=['side-plank','push-up'].map(id=>EXERCISES.find(ex=>ex.id===id));selected=new Set(['quads']);printRoutine()",context);
  await vm.runInContext('copyRoutineText()',context);
  assert.equal(printed,1);
  assert.ok(copied.indexOf('1. Side Plank')<copied.indexOf('2. Push-Up'));
  assert.match(copied,/Set elbow under shoulder/);assert.match(copied,/Secondary:/);
  assert.ok(output.innerHTML.indexOf('Side Plank')<output.innerHTML.indexOf('Push-Up'));
  assert.doesNotMatch(output.innerHTML,/Quadriceps/);
  assert.doesNotMatch(copied,/Selected muscles: Quadriceps/);
});
test('inline application script compiles alongside the routine module',()=>{
  const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
  assert.doesNotThrow(()=>new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]));
});
