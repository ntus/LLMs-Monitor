import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,power,QUERY} from '../server/intelligence-worker.mjs';

test('worker query includes staff, official providers and BridgeMind',()=>{for(const name of ['thsottiaux','OpenAI','AnthropicAI','GoogleAI','bridgemindai'])assert.match(QUERY,new RegExp(`from:${name}`))});
test('irrelevant posts do not enter the feed',()=>assert.equal(classify({id:'1',text:'Hello world',created_at:'2026-10-03T00:00:00Z'},{username:'OpenAI'}),null));
test('usage and reset announcements are classified',()=>{assert.equal(classify({id:'1',text:'We reset usage limits across plans'},{username:'thsottiaux'}).kind,'reset');assert.equal(classify({id:'2',text:'New usage limits for Claude plans'},{username:'AnthropicAI'}).kind,'usage')});
test('NerfBench below 90 percent becomes critical independent intelligence',()=>{const row=classify({id:'3',text:'Nerf Bench follow-up: model power is 88.5%'},{username:'bridgemindai'});assert.equal(row.kind,'nerf');assert.equal(row.currentPower,88.5);assert.equal(row.severity,'critical');assert.match(row.account,/independent/)});
test('power parser rejects impossible percentages',()=>{assert.equal(power('power 103.8%'),103.8);assert.equal(power('power 900%'),null)});
