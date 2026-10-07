const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const RoutineModel=require('../routine-model.js');
const html=readFileSync(join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];

function app(){
  const elements=new Map(), saved=new Map();
  let focused='';
  const element=selector=>{
    if(!elements.has(selector)) elements.set(selector,{value:selector==='#muscleSearch'?'':'all',textContent:'',innerHTML:'',selectedOptions:[{textContent:'All'}],setAttribute(){},addEventListener(){},focus(){focused=selector;}});
    return elements.get(selector);
  };
  const storage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
  const context=vm.createContext({document:{querySelector:element,querySelectorAll:()=>[]},RoutineModel,storage});
  const run=code=>vm.runInContext(code,context);
  run(script.slice(0,script.indexOf("q('#atlasView').addEventListener")));
  run('routineStore=RoutineModel.createStore(EXERCISES.map(ex=>ex.id),storage);');
  return {run,element,focused:()=>focused,ids:()=>Array.from(run('routineStore.current()')),restored:()=>RoutineModel.createStore(run('EXERCISES.map(ex=>ex.id)'),storage).current()};
}

test('review shows additions and named removals without editing the kept routine',()=>{
  const a=app();
  a.run("routineStore.replace(['side-plank','push-up']);lastSuggestions=['push-up','goblet-squat'].map(id=>EXERCISES.find(ex=>ex.id===id));");
  const output=a.run('renderSuggestionReview()');
  assert.match(output,/Review current suggestions · 1 new/);
  assert.match(output,/Already in your routine · Bodyweight/);
  assert.match(output,/New to your routine · Dumbbell/);
  assert.match(output,/Replacing removes 1: Side Plank/);
  assert.match(output,/Add 1 new exercise/);
  assert.match(output,/Replace my routine/);
  assert.deepEqual(a.ids(),['side-plank','push-up']);
  assert.deepEqual(a.restored(),['side-plank','push-up']);
});

test('add suggestions appends only new identities, preserves order, saves and undoes as one edit',()=>{
  const a=app();
  a.run("routineStore.replace(['side-plank','push-up']);lastSuggestions=['push-up','goblet-squat','biceps-curl'].map(id=>EXERCISES.find(ex=>ex.id===id));editRoutine('append-suggestions');");
  assert.deepEqual(a.ids(),['side-plank','push-up','goblet-squat','biceps-curl']);
  assert.deepEqual(a.restored(),a.ids());
  assert.match(a.element('#resultStatus').textContent,/2 new exercises added. Your previous order was kept/);
  assert.equal(a.focused(),'#suggestionReview summary');
  a.run("editRoutine('undo')");
  assert.deepEqual(a.ids(),['side-plank','push-up']);
  assert.deepEqual(a.restored(),a.ids());
});

test('replace applies the reviewed order and Undo restores removed entries in their old order',()=>{
  const a=app();
  a.run("routineStore.replace(['side-plank','push-up']);lastSuggestions=['goblet-squat','push-up'].map(id=>EXERCISES.find(ex=>ex.id===id));editRoutine('replace-suggestions');");
  assert.deepEqual(a.ids(),['goblet-squat','push-up']);
  assert.match(a.element('#resultStatus').textContent,/Routine replaced with the reviewed suggestions/);
  assert.equal(a.focused(),'#suggestionReview summary');
  a.run("editRoutine('undo')");
  assert.deepEqual(a.ids(),['side-plank','push-up']);
});

test('changed and empty filters update the preview while keeping the saved routine intact',()=>{
  const a=app();
  a.run("routineStore.replace(['side-plank']);suggestionReviewOpen=true;");
  a.element('#muscleSearch').value='goblet';
  a.run('updateAll()');
  assert.deepEqual(Array.from(a.run('lastSuggestions.map(ex=>ex.id)')),['goblet-squat']);
  assert.match(a.element('#results').innerHTML,/id="suggestionReview"[^>]* open/);
  assert.match(a.element('#results').innerHTML,/Replacing removes 1: Side Plank/);
  a.element('#muscleSearch').value='nothingmatches';
  a.run('updateAll()');
  const review=a.run('renderSuggestionReview()');
  assert.match(review,/No suggestions match/);
  assert.doesNotMatch(review,/data-routine-action/);
  a.run("editRoutine('append-suggestions');editRoutine('replace-suggestions');");
  assert.deepEqual(a.ids(),['side-plank']);
  assert.deepEqual(a.restored(),['side-plank']);
  assert.deepEqual(Array.from(a.run('lastRoutine.map(ex=>ex.id)')),['side-plank']);
});

test('matching suggestions are disabled and consume no undo, while a different order can replace',()=>{
  const a=app();
  a.run("routineStore.replace(['side-plank','push-up']);lastSuggestions=['side-plank','push-up'].map(id=>EXERCISES.find(ex=>ex.id===id));");
  let review=a.run('renderSuggestionReview()');
  assert.match(review,/already match your routine and its order/);
  assert.match(review,/data-routine-action="append-suggestions" disabled/);
  assert.match(review,/data-routine-action="replace-suggestions" disabled/);
  a.run("editRoutine('append-suggestions');editRoutine('replace-suggestions');routineStore.undo();");
  assert.equal(a.run('routineStore.current()'),null);
  a.run("routineStore.replace(['push-up','side-plank']);");
  review=a.run('renderSuggestionReview()');
  assert.match(review,/data-routine-action="replace-suggestions" >/);
  a.run("editRoutine('replace-suggestions')");
  assert.deepEqual(a.ids(),['side-plank','push-up']);
});

test('reviewing an empty saved routine can add suggestions and undo returns to saved emptiness',()=>{
  const a=app();
  a.run("routineStore.clear();lastSuggestions=[EXERCISES.find(ex=>ex.id==='push-up')];editRoutine('append-suggestions');");
  assert.deepEqual(a.ids(),['push-up']);
  a.run("editRoutine('undo')");
  assert.deepEqual(a.ids(),[]);
  assert.deepEqual(a.restored(),[]);
});
