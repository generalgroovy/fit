const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const html=readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
function setup(clipboard){let message='',output=null;const context=vm.createContext({navigator:{clipboard},selected:new Set(),lastRoutine:[],modeTitle:()=> 'Exercise finder',flashCopy(msg){message=msg;},q(id){return id==='#results'?{prepend(el){output=el;}}:output;},document:{createElement(){return {style:{},setAttribute(){},focus(){this.focused=true;},select(){this.selected=true;}};}}});vm.runInContext(html.slice(html.indexOf('async function copyRoutineText'),html.indexOf('function flashCopy')),context);return {copy:()=>vm.runInContext('copyRoutineText()',context),message:()=>message,output:()=>output};}
test('successful copy writes the complete routine',async()=>{let text;const app=setup({async writeText(value){text=value;}});await app.copy();assert.match(text,/Muscle Atlas Trainer routine/);assert.equal(app.message(),'Copied');assert.equal(app.output(),null);});
test('unavailable or rejected clipboard provides selected text for manual copy',async()=>{for(const clipboard of [undefined,{async writeText(){throw Error('denied');}}]){const app=setup(clipboard);await app.copy();assert.match(app.output().value,/Muscle Atlas Trainer routine/);assert.equal(app.output().selected,true);assert.equal(app.message(),'Select and copy below');}});

