const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');

test('single-select can deselect the active muscle and replace it with another',()=>{
  const context=vm.createContext({selected:new Set(['arms']),multiSelect:false,updateAll(){}});
  vm.runInContext(html.slice(html.indexOf('function toggleMuscle('),html.indexOf('function showMusclePreview(')),context);
  vm.runInContext("toggleMuscle('arms')",context);
  assert.equal(context.selected.size,0);
  vm.runInContext("toggleMuscle('arms');toggleMuscle('legs')",context);
  assert.deepEqual([...context.selected],['legs']);
});

test('expanding and closing an exercise restores focus to its replacement control',()=>{
  let focused='',renders=0;
  const context=vm.createContext({openedExercise:null,previewExercise:null,EXERCISES:[{id:'squat'}],updateAll(){renders++;},q(selector){return {focus(){focused=selector;}};}});
  vm.runInContext(html.slice(html.indexOf('function toggleExercise('),html.indexOf('function updateAll(')),context);
  vm.runInContext("toggleExercise('squat')",context);
  assert.equal(context.openedExercise,'squat');
  assert.equal(context.previewExercise.id,'squat');
  assert.equal(focused,'.exercise[data-exercise="squat"] .ex-head');
  vm.runInContext("toggleExercise('squat')",context);
  assert.equal(context.openedExercise,null);
  assert.equal(context.previewExercise,null);
  assert.equal(renders,2);
});


test('phone atlas view changes only visibility and retains muscle selections',()=>{
  const cards=['front','back','left','right'].map(view=>({dataset:{view},classList:{toggle(_,active){this.active=active;}}}));
  const selected=new Set(['arms']);
  const context=vm.createContext({qa:()=>cards,selected});
  vm.runInContext(html.slice(html.indexOf('function setAtlasView('),html.indexOf('function toggleMuscle(')),context);
  vm.runInContext("setAtlasView('back')",context);
  assert.deepEqual(cards.filter(card=>card.classList.active).map(card=>card.dataset.view),['back']);
  assert.deepEqual([...selected],['arms']);
});
