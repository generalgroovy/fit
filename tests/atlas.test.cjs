const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function data(){const ctx=vm.createContext({});vm.runInContext(script.slice(0,script.indexOf('const q =')),ctx);return {ctx,run:s=>vm.runInContext(s,ctx)};}

test('every selectable muscle has a map region and location/action description',()=>{
  const app=data();
  assert.equal(app.run('MUSCLES.every(m=>Object.values(BODY_REGIONS).some(regions=>regions.some(r=>r[2]===m.id)) && MUSCLE_DETAILS[m.id])'),true);
  assert.equal(app.run("BODY_REGIONS.front.filter(r=>r[2]==='neck').every(r=>r[0]!=='ellipse')"),true);
  assert.equal(app.run('EXERCISES.every(ex=>[...ex.primary,...ex.secondary].every(id=>[...BODY_REGIONS.front,...BODY_REGIONS.back].some(region=>region[2]===id)))'),true);
});
test('paired muscles render as independent hit targets rather than a gap-centered button',()=>{
  const app=data();app.ctx.escapeHtml=s=>s;
  vm.runInContext(script.slice(script.indexOf('function attrsToString'),script.indexOf('function renderBody')),app.ctx);
  const rendered=app.run("regionShape(...BODY_REGIONS.front.find(r=>r[2]==='quads'))");
  assert.equal((rendered.match(/role="button"/g)||[]).length,2);
  assert.equal((rendered.match(/data-muscle="quads"/g)||[]).length,2);
});
test('muscle-name search excludes unrelated exercises',()=>{
  const app=data();
  vm.runInContext(script.slice(script.indexOf('function exerciseMatchesFilters'),script.indexOf('function exerciseScore')),app.ctx);
  assert.equal(app.run("exerciseMatchesFilters(EXERCISES.find(e=>e.id==='biceps-curl'),{type:'all',equipment:'all',difficulty:'all',search:'quadriceps'})"),false);
  assert.equal(app.run("exerciseMatchesFilters(EXERCISES.find(e=>e.id==='goblet-squat'),{type:'all',equipment:'all',difficulty:'all',search:'quadriceps'})"),true);
  assert.equal(app.run("exerciseMatchesFilters(EXERCISES.find(e=>e.id==='push-up'),{type:'all',equipment:'all',difficulty:'all',search:'chest'})"),true);
  assert.equal(app.run("exerciseMatchesFilters(EXERCISES.find(e=>e.id==='goblet-squat'),{type:'all',equipment:'all',difficulty:'all',search:'chest'})"),false);
});
test('routine generation uses only the visible filtered candidate list',()=>{
  const app=data();
  app.ctx.filters=()=>({type:'all'});
  vm.runInContext(script.slice(script.indexOf('function exerciseScore'),script.indexOf('function currentList')),app.ctx);
  vm.runInContext(script.slice(script.indexOf('function generateRoutine'),script.indexOf('function coveragePercent')),app.ctx);
  for(const mode of ['finder','maxCoverage','balanced','isolate','mobility']) {
    app.run(`activeMode='${mode}';globalThis.candidates=EXERCISES.filter(e=>e.equipment==='bodyweight')`);
    assert.equal(app.run('generateRoutine(candidates).every(e=>candidates.includes(e))'),true);
  }
});
test('print routine contains only escaped current exercises and their instructions',()=>{
  const app=data();let output,printed=0;
  app.ctx.q=()=>output={innerHTML:''};app.ctx.window={print(){printed++;}};
  app.ctx.escapeHtml=s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;');app.ctx.setText=()=>'';
  vm.runInContext(script.slice(script.indexOf('function printRoutine'),script.indexOf('function renderSources')),app.ctx);
  app.run("lastRoutine=[{name:'<custom>',primary:['quads'],steps:['Step 1'],cautions:'Keep control'}];printRoutine()");
  assert.equal(printed,1);assert.match(output.innerHTML,/&lt;custom&gt;/);assert.match(output.innerHTML,/Step 1/);assert.doesNotMatch(output.innerHTML,/<custom>/);
});
