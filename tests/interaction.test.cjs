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

test('removing a selected muscle keeps keyboard focus on a remaining chip or the results heading',()=>{
  let focused='',renders=0;
  const context=vm.createContext({selected:new Set(['pecs','biceps']),previewExercise:{},openedExercise:'push-up',updateAll(){renders++;},q(selector){return {focus(){focused=selector;}};}});
  vm.runInContext(html.slice(html.indexOf('function removeMuscle('),html.indexOf('function updateBrowseContext(')),context);
  vm.runInContext("removeMuscle('pecs')",context);
  assert.deepEqual([...context.selected],['biceps']);
  assert.equal(focused,'[data-remove="biceps"]');
  assert.equal(context.previewExercise,null);
  vm.runInContext("removeMuscle('biceps')",context);
  assert.equal(focused,'#exerciseHeading');
  assert.equal(renders,2);
});

test('routine navigation opens the saved routine and moves focus to its summary',()=>{
  let scrolled=false,focused=false;
  const details={open:false,scrollIntoView(){scrolled=true;}};
  const summary={focus(){focused=true;}};
  const context=vm.createContext({routineOpen:false,q(selector){return selector==='summary'?summary:details;}});
  vm.runInContext(html.slice(html.indexOf('function jumpTo('),html.indexOf('function removeMuscle(')),context);
  vm.runInContext("jumpTo('routineDetails')",context);
  assert.equal(details.open,true);
  assert.equal(context.routineOpen,true);
  assert.equal(scrolled,true);
  assert.equal(focused,true);
});

test('collapsed refinement remains understandable and reset restores an unfiltered search',()=>{
  const fields=new Map();
  const q=selector=>{if(!fields.has(selector))fields.set(selector,{textContent:'',hidden:false,value:'',selectedOptions:[{textContent:'Bodyweight'}]});return fields.get(selector);};
  const state={type:'all',equipment:'bodyweight',difficulty:'all',search:'<chest>'};
  q('#muscleSearch').value='<chest>';
  const context=vm.createContext({q,filters:()=>state,selected:new Set(['pecs']),activeMode:'finder',modeTitle:()=>'',activeModeHint:()=>'Mode explanation'});
  vm.runInContext(html.slice(html.indexOf('function updateBrowseContext('),html.indexOf('function toggleExercise(')),context);
  vm.runInContext('updateBrowseContext([{}],[{}],null)',context);
  assert.equal(q('#filterCount').textContent,'· 1 active');
  assert.equal(q('#filterSummary').textContent,'1 muscle group · Bodyweight · Search: “<chest>”');
  assert.equal(q('#resultStatus').textContent,'1 matching exercise. 1 muscle group · Bodyweight · Search: “<chest>”.');
  assert.equal(q('#routineJump').textContent,'Routine');
  assert.equal(q('#resetFilters').hidden,false);
  state.equipment='all';state.search='';
  vm.runInContext('selected.clear();updateBrowseContext([],[],[])',context);
  assert.equal(q('#filterSummary').textContent,'All muscles');
  assert.equal(q('#resetFilters').hidden,true);
  assert.equal(q('#routineJump').textContent,'Routine · 0');
});
