window.__ModuleLoader__.load({
	id: "dsh-live2d-mygo",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/waifu/config.js
		function readStoredId(key) {
			const value = parseInt(localStorage.getItem(key), 10);
			return Number.isNaN(value) || value < 0 ? null : value;
		}
		let modelId = readStoredId("modelId");
		let modelTexturesId = readStoredId("modelTexturesId");
		let config = {};
		let messageArray = [];
		function getModelId() {
			if (modelId === null || modelId === void 0) resetModelState();
			return modelId;
		}
		function setModelId(newModelId) {
			modelId = newModelId;
			localStorage.setItem("modelId", newModelId.toString());
		}
		function getModelTexturesId() {
			if (modelTexturesId === null || modelTexturesId === void 0) resetModelState();
			return modelTexturesId;
		}
		function setModelTexturesId(newModelTexturesId) {
			modelTexturesId = newModelTexturesId;
			localStorage.setItem("modelTexturesId", newModelTexturesId.toString());
		}
		function resetModelState() {
			modelId = 0;
			modelTexturesId = 0;
			localStorage.setItem("modelId", "0");
			localStorage.setItem("modelTexturesId", "0");
		}
		function getConfig() {
			return config;
		}
		function setConfig(newConfig) {
			config = newConfig;
		}
		function getMessageArray() {
			return messageArray;
		}
		function updateMessageArray(result) {
			messageArray = result.message.default[getModelId()];
			result.seasons.forEach(({ date, text }) => {
				const now = /* @__PURE__ */ new Date(), nowMonth = now.getMonth() + 1, nowDate = now.getDate(), after = date.split("-")[0], afterMonth = parseInt(after.split("/")[0]), afterDate = parseInt(after.split("/")[1]), before = date.split("-")[1] || after, beforeMonth = parseInt(before.split("/")[0]), beforeDate = parseInt(before.split("/")[1]);
				const isCrossYear = afterMonth > beforeMonth;
				let isInRange = false;
				if (isCrossYear) isInRange = nowMonth > afterMonth || nowMonth === afterMonth && nowDate >= afterDate || nowMonth < beforeMonth || nowMonth === beforeMonth && nowDate <= beforeDate;
				else isInRange = (nowMonth > afterMonth || nowMonth === afterMonth && nowDate >= afterDate) && (nowMonth < beforeMonth || nowMonth === beforeMonth && nowDate <= beforeDate);
				if (isInRange) for (let t of text[getModelId()]) messageArray.push(t);
			});
			result.time.forEach(({ hour, text }) => {
				const now = /* @__PURE__ */ new Date(), after = hour.split("-")[0], before = hour.split("-")[1] || after;
				if (after <= now.getHours() && now.getHours() <= before) for (let t of text[getModelId()]) messageArray.push(t);
			});
		}
		//#endregion
		//#region src/client/waifu/utils.js
		function randomSelection(obj) {
			if (Array.isArray(obj)) return obj[Math.floor(Math.random() * obj.length)];
			else if (typeof obj === "number") return Math.floor(Math.random() * obj);
			else return obj;
		}
		//#endregion
		//#region src/client/waifu/message.js
		let messageTimer;
		function showMessage(model, text, timeout, priority) {
			if (!text) return;
			const storedPriority = parseInt(sessionStorage.getItem("waifu-text"), 10);
			if (!Number.isNaN(storedPriority) && storedPriority > priority) return;
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			text = randomSelection(text);
			sessionStorage.setItem("waifu-text", priority);
			const tips = document.getElementById("waifu-tips");
			if (tips) {
				tips.innerHTML = text.text || "";
				tips.classList.add("waifu-tips-active");
			}
			messageTimer = setTimeout(() => {
				sessionStorage.removeItem("waifu-text");
				if (tips) tips.classList.remove("waifu-tips-active");
			}, timeout);
			if (model && model.model) {
				if (text.motion) try {
					model.model.motion(text.motion);
				} catch (error) {}
				if (text.expression) try {
					model.model.expression(text.expression);
				} catch (error) {}
			}
		}
		/** 清理未完成的气泡定时器（插件卸载 / HMR 重建时调用，防止残留 setTimeout）。 */
		function clearMessageTimer() {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
		}
		//#endregion
		//#region src/client/waifu/modelList.js
		const modelList = [
			[
				"036_casual-2023_常服",
				"036_school_winter-2023_校服冬",
				"036_school_summer-2023_校服夏",
				"036_live_default_默认",
				"036_live_sr_01_演出SR01",
				"036_live_event_235_ur_活动235",
				"036_live_event_240_ssr_活动240",
				"036_live_event_250_ur_活动250",
				"036_live_event_286_ur_活动286",
				"036_live_event_289_ur_活动289",
				"036_live_event_297_ur_活动297",
				"036_birthday_2024_ssr_生日2024",
				"036_dream_festival_3_ur_梦祭3",
				"036_collabo_a_ur_联动A",
				"036_collabo_d_3_ur_联动D3",
				"036_2024_furisode_振袖2024"
			],
			[
				"037_casual-2023_常服",
				"037_school_winter-2023_校服冬",
				"037_school_summer-2023_校服夏",
				"037_live_default_默认",
				"037_live_sr_01_演出SR01",
				"037_live_event_235_ur_活动235",
				"037_live_event_240_sr_活动240",
				"037_live_event_250_r_活动250",
				"037_live_event_253_ur_活动253",
				"037_live_event_277_sr_活动277",
				"037_live_event_286_sr_活动286",
				"037_live_event_297_sr_活动297",
				"037_birthday_2024_ssr_生日2024",
				"037_dream_festival_3_ur_梦祭3",
				"037_collabo_a_ur_联动A"
			],
			[
				"038_casual-2023_常服",
				"038_school_winter-2023_校服冬",
				"038_school_summer-2023_校服夏",
				"038_live_default_默认",
				"038_live_sr_01_演出SR01",
				"038_live_event_235_sr_活动235",
				"038_live_event_240_ur_活动240",
				"038_live_event_250_sr_活动250",
				"038_live_event_286_ur_活动286",
				"038_live_event_297_sr_活动297",
				"038_birthday_2024_ssr_生日2024",
				"038_dream_festival_3_ur_梦祭3",
				"038_collabo_a_ur_联动A"
			],
			[
				"039_casual-2023_常服",
				"039_school_winter-2023_校服冬",
				"039_school_summer-2023_校服夏",
				"039_live_default_默认",
				"039_live_sr_01_演出SR01",
				"039_live_event_235_ur_活动235",
				"039_live_event_240_r_活动240",
				"039_live_event_250_ur_活动250",
				"039_live_event_286_ssr_活动286",
				"039_live_event_289_ur_活动289",
				"039_live_event_297_ur_活动297",
				"039_birthday_2024_ssr_生日2024",
				"039_dream_festival_3_ur_梦祭3",
				"039_collabo_a_ur_联动A"
			],
			[
				"040_casual-2023_常服",
				"040_school_winter-2023_校服冬",
				"040_school_summer-2023_校服夏",
				"040_live_default_默认",
				"040_live_sr_01_演出SR01",
				"040_live_event_235_sr_活动235",
				"040_live_event_240_ur_活动240",
				"040_live_event_250_ssr_活动250",
				"040_live_event_277_ur_活动277",
				"040_live_event_286_r_活动286",
				"040_live_event_297_ur_活动297",
				"040_birthday_2024_ssr_生日2024",
				"040_dream_festival_3_ur_梦祭3",
				"040_collabo_a_ur_联动A",
				"040_arbeit_打工",
				"040_event_277_story_01_剧情277"
			]
		];
		//#endregion
		//#region src/client/waifu/tips.js
		const tips = {
			"message": {
				"default": [
					[
						{
							"text": "这是纹颊企鹅……这是阿德利企鹅……我还有别的企鹅系列创可贴哦。",
							"motion": "smile01"
						},
						{
							"text": "能和我组一辈子的乐队吗？",
							"motion": "kandou01"
						},
						{
							"text": "比起悲伤之情，我先想到的是……如果把泪水收集起来就好了……",
							"motion": "sad01"
						},
						{
							"text": "已经落下来的花，应该是死掉了……",
							"motion": "sad02"
						},
						{
							"text": "这个笔记本，封面有各种图案……我有全部种类。",
							"motion": "smile02"
						},
						{
							"text": "之前小祥说的独角仙笔记本……我找了很久才买到……",
							"motion": "smile03"
						},
						{
							"text": "想要……成为人类……",
							"motion": "serious01"
						},
						{
							"text": "我想拥有重要的事物……让我像大家那样流泪……",
							"motion": "cry01"
						},
						{
							"text": "小爱，一直在前进。就算遇到了死胡同，也会努力寻找出路，试图向前……",
							"motion": "thinking01"
						},
						{
							"text": "即便迷茫，也要前进！",
							"motion": "kime01"
						},
						{
							"text": "要一起前进吗？我们一起继续迷路下去……",
							"motion": "kime02"
						},
						{
							"text": "海洋生物系列第6弹。珊瑚礁鬼蝠𫚉、翻车鱼、皇带鱼、鲸鲨、蓝鲸和长须鲸……",
							"motion": "smile04"
						},
						{
							"text": "我们怀着脆弱的内心活着，生来就是易伤的动物……",
							"motion": "sad03"
						},
						{
							"text": "我能做的就只有拼命去唱了，因为我的歌，就是内心的呐喊！",
							"motion": "sing01"
						},
						{
							"text": "光芒穿过云间，闪闪发亮；填满我的心，直到满溢。",
							"motion": "sing02"
						},
						{
							"text": "泪水流不出来，眼角却隐隐刺痛……",
							"motion": "cry02"
						},
						{
							"text": "即便在大都市，也能看到北极星……第一次发现的时候很惊讶。",
							"motion": "surprised01"
						},
						{
							"text": "说不出口的话，歌可以比话语更好地表达……",
							"motion": "thinking02"
						},
						{
							"text": "就算迷失方向，绕了远路……还是有人陪我前进！",
							"motion": "kandou02"
						},
						{
							"text": "我需要爱音！不能没有小爱！让我们……一起迷路吧……",
							"motion": "kandou03"
						},
						{
							"text": "一辈子不受伤，是不可能的。就算满身伤痕、满身污泥……也要拼尽全力！",
							"motion": "serious02"
						},
						{
							"text": "小爱她非常迷茫，我也想成为她那样的迷路的孩子……",
							"motion": "sad04"
						},
						{
							"text": "当我不安时，小乐奈总会陪在我身边……",
							"motion": "smile01"
						},
						{
							"text": "即使我们家最近的车站不一样，小立希也总会送我到家门口。",
							"motion": "smile01"
						},
						{
							"text": "迷路也不要紧，迷茫也要前进！",
							"motion": "kime01"
						},
						{
							"text": "只要将无数个瞬间积攒起来……我想就能成为一辈子。",
							"motion": "thinking01"
						},
						{
							"text": "要是创可贴，也能贴在心灵上就好了……",
							"motion": "shame01"
						},
						{
							"text": "小立希……可以夸一夸小爱吗？",
							"motion": "shame02"
						},
						{
							"text": "小乐奈，这块石头的形状……格外像猫咪……",
							"motion": "smile02"
						},
						{
							"text": "小爱想了解……过去的我？那……我明天把小时候的照片……拿来吧。",
							"motion": "smile03"
						},
						{
							"text": "只有我和小乐奈两个人的时候，该聊点什么呢？",
							"motion": "thinking02"
						},
						{
							"text": "我是不是……也去弹乐器比较好……？小爱之前说过的……手鼓或是三角铁之类的……",
							"motion": "serious01"
						},
						{
							"text": "发现了好东西……太好了！",
							"motion": "surprised01"
						},
						{
							"text": "……我想要透明的盒子，想把石头都摆在一起……",
							"motion": "thinking01"
						},
						{
							"text": "啊，那个……我想……既然是命中注定，那也没办法吧。",
							"motion": "shame01"
						},
						{
							"text": "……鱼肉汉堡和鳄梨汉堡……该选哪个呢……",
							"motion": "thinking02"
						},
						{
							"text": "今天有体育课。虽然我不擅长运动……但「即便迷茫，也要前进」！",
							"motion": "kime01"
						},
						{
							"text": "……啊。果汁，我中奖了……！多掉出来一瓶……要是拿给小爱，她会不会开心呢？",
							"motion": "surprised01"
						},
						{
							"text": "有好多种款式的拨片在卖……这是，眼泪的形状……？这边的……好像是饭团……",
							"motion": "smile04"
						},
						{
							"text": "今天的天文馆……「黄道十二星座特辑」……不过，水族馆也有……「海中宝石特辑」……",
							"motion": "thinking01"
						},
						{
							"text": "……前任天文部部长在日志上留下了一段话。「只要好好把活动成果报告给学生会就好了哦！」",
							"motion": "serious02"
						},
						{
							"text": "有好多乐队的宣传单……！「幽灵合唱团」「方吐司的被窝」「追逐会动的点P」……",
							"motion": "surprised01"
						},
						{
							"text": "我觉得……鱼子里面……蕴含着生命……",
							"motion": "thinking02"
						},
						{
							"text": "上大学后，衣服……每天都要自己挑选，好像很麻烦……",
							"motion": "sad01"
						},
						{
							"text": "买了许多便签……感觉可以用便签来排列话语……",
							"motion": "smile01"
						}
					],
					[
						{
							"text": "为了下次不失败而努力不就好了？",
							"motion": "kime01"
						},
						{
							"text": "就算失败一次，也要有重来的信心。",
							"motion": "kime02"
						},
						{
							"text": "就算失败一次，也要有重来的信心。不然人生这么长，怎么过得下去？",
							"motion": "kime02"
						},
						{
							"text": "月之森的同学真的会用「贵安」打招呼吗？",
							"motion": "thinking01"
						},
						{
							"text": "快速轻松提升水平计划失败……反正现在练习也不可能立马弹得好，先看看喵梦亲吧。",
							"motion": "sad01"
						},
						{
							"text": "那么～要不要一起前进？一起在迷失之中前进。",
							"motion": "smile01"
						},
						{
							"text": "我没有逃避！……什么没逃避，明明是拼了命逃掉了……",
							"motion": "shame01"
						},
						{
							"text": "就算迷茫，也要前进！",
							"motion": "kime01"
						},
						{
							"text": "好疼……练吉他的时候，手指都肿成这样了……",
							"motion": "cry01"
						},
						{
							"text": "爽世世给我推荐的香薰，让人放松的效果太好了～",
							"motion": "smile02"
						},
						{
							"text": "上次和灯灯等狸希的时候，等了2小时56分31秒～",
							"motion": "thinking02"
						},
						{
							"text": "我很擅长写作文的！",
							"motion": "smile03"
						},
						{
							"text": "小乐奈和……好长的猫！",
							"motion": "surprised01"
						},
						{
							"text": "气氛好热烈！大家都穿着可爱的舞台服，好羡慕～",
							"motion": "smile04"
						},
						{
							"text": "我在台上看得到大家哦～",
							"motion": "smile01"
						},
						{
							"text": "爽世世那么温柔，肯定会原谅我的！",
							"motion": "smile02"
						},
						{
							"text": "都是灯灯的错哦！",
							"motion": "angry01"
						},
						{
							"text": "爽世世的家简直就是豪华酒店，毫无生活气息啊～",
							"motion": "thinking03"
						},
						{
							"text": "爽世世表里不一、满嘴谎言，还有好多坏心眼哦！",
							"motion": "angry02"
						},
						{
							"text": "我不会退出了，爽世世也不要退出哦～",
							"motion": "smile03"
						},
						{
							"text": "狸希真是专一啊，这就不理我了？",
							"motion": "sad02"
						},
						{
							"text": "被固有印象束缚，我觉得可不太好～表现方式就应该多种多样！",
							"motion": "thinking01"
						},
						{
							"text": "话说这夜景好漂亮，大家一起来拍照吧！之后发到社交平台上！",
							"motion": "smile04"
						},
						{
							"text": "小乐奈的吉他，要用多久才会变成这样呢……？",
							"motion": "thinking02"
						},
						{
							"text": "我的效果器被爽世世踩了……连我自己都没踩过呢……",
							"motion": "cry02"
						},
						{
							"text": "要不我也去办个水族馆年票吧……？",
							"motion": "thinking03"
						},
						{
							"text": "Sumimi 的初华……好温柔！怎么办！好开心！",
							"motion": "smile01"
						},
						{
							"text": "呐呐，狸希也夸夸我可爱吧？",
							"motion": "wink01"
						},
						{
							"text": "狸希在听什么？阿夫特楼的歌？……是Afterglow前辈们的优美乐曲吗？",
							"motion": "thinking01"
						},
						{
							"text": "只有爽世世和狸希了解过去的灯灯太不公平了！再多跟我讲讲灯灯的事情啦！",
							"motion": "angry03"
						},
						{
							"text": "诶诶～爽世世不让我们到家里面去吗～",
							"motion": "sad01"
						},
						{
							"text": "我们不是可疑人士～是住这里45层的长崎小姐的朋友！",
							"motion": "smile02"
						},
						{
							"text": "RiNG的时令菜单很时尚呢～",
							"motion": "smile03"
						},
						{
							"text": "拨片快用完了……我要去买一些。灯灯有什么需要的吗？",
							"motion": "thinking02"
						},
						{
							"text": "呐呐，爽世世，在月之森，学生之间会互相邀请参加派对吗？",
							"motion": "thinking03"
						},
						{
							"text": "在Live House打工，总觉得很帅气呢～我要不要也在 RiNG 打工呢？",
							"motion": "thinking01"
						},
						{
							"text": "买了很多，暂时没有购物欲了……啊！？那边的连衣裙……是之前售罄的款式……！",
							"motion": "surprised01"
						},
						{
							"text": "诶，不会吧，又有货了？这难道是命中注定的吗！？不不这个月可不能再买了……",
							"motion": "thinking02"
						},
						{
							"text": "那个风衣的兜帽上有猫耳，感觉应该挺适合小乐奈的吧？",
							"motion": "smile04"
						},
						{
							"text": "这种东西，要是别人送的，不是更开心吗？",
							"motion": "wink01"
						},
						{
							"text": "要不要点一份芝士汉堡搭薯条的套餐呢～灯灯你要点什么？",
							"motion": "smile01"
						},
						{
							"text": "那要不然，我选鳄梨汉堡，灯灯选鱼肉汉堡吧？我们可以互相分一半哦！",
							"motion": "smile02"
						},
						{
							"text": "BLT汉堡是培根生菜番茄汉堡的简称哦！可能是因为读起来太长了？",
							"motion": "thinking03"
						},
						{
							"text": "呐呐，爽世世～关于这次的练习啊……我说，你那是什么表情啊",
							"motion": "angry04"
						},
						{
							"text": "诶～不喜欢「爽世世」的话，那就叫Soyorinu怎么样？爽世之助？爽世·危？",
							"motion": "wink01"
						},
						{
							"text": "狸希～！这里有杏仁豆腐奶昔！这边是杏仁豆腐冰淇淋！还有杏仁豆腐汉堡哦！",
							"motion": "smile03"
						},
						{
							"text": "灯灯很喜欢天文馆呢～不过也是，在城市里很难看清星星呢。",
							"motion": "thinking01"
						},
						{
							"text": "话说回来……小乐奈给人的印象，不像是会去上学的感觉……？",
							"motion": "thinking02"
						},
						{
							"text": "呜呜……手指好痛～练习好辛苦……我可没说过我要放弃！",
							"motion": "cry01"
						},
						{
							"text": "哎呀～吓我一跳。没想到居然会搞错练习的日期呢～",
							"motion": "surprised01"
						},
						{
							"text": "虽然有点在意卡路里……但只要通过乐队训练来消耗多摄入的卡路里，就没问题了！",
							"motion": "smile04"
						},
						{
							"text": "哎呀～初中的时候玩过乐队真是太好了～Thank you～当时的我！",
							"motion": "smile01"
						},
						{
							"text": "总感觉这附近有很多打扮得很成熟的人……",
							"motion": "thinking03"
						},
						{
							"text": "既然站在这里不会有不协调的感觉，就证明我也没输给她们吧！",
							"motion": "smile02"
						},
						{
							"text": "咦，有玩偶掉在地上了……用MyGO!!!!!的社交平台账号找到它的主人吧！",
							"motion": "thinking01"
						},
						{
							"text": "诶，这边的是新款连衣裙！？那边的是现在正在引发热议的甜点店的活动店铺！？",
							"motion": "surprised01"
						},
						{
							"text": "连sumimi的CD都出新的了～！哎呀～赶潮流真是太累人了呢～",
							"motion": "smile03"
						},
						{
							"text": "灯灯，那边有好多扭蛋哦～我在想，你是不是喜欢那种东西……要去看看吗？",
							"motion": "smile04"
						},
						{
							"text": "今天有努力练习，所以买了一份草莓豪华可丽饼～♪",
							"motion": "smile01"
						},
						{
							"text": "在这个车站附近，经常能看到月之森的学生……大家不应该都是由车子接送的吗？",
							"motion": "thinking02"
						},
						{
							"text": "那个、那个，你觉得MyGO!!!!!的队长到底是谁啊？",
							"motion": "thinking03"
						},
						{
							"text": "如果我没有邀请迷住大家的灯灯，或许现在就不会有MyGO!!!!!的诞生了哦？",
							"motion": "smile02"
						},
						{
							"text": "说到底，好的音频线是什么样的？看颜色？看光滑度？看挺括感？",
							"motion": "thinking01"
						},
						{
							"text": "啊，现在放的是sumimi的新歌。如果今后也会有人像这样播放我们的歌就好了呢。",
							"motion": "smile03"
						},
						{
							"text": "能买到帅气的拨片真是太好了～♪等下拍照发到社交网站上吧！",
							"motion": "smile04"
						},
						{
							"text": "咦～？我应该把唇膏放在这里面了呀？",
							"motion": "thinking02"
						},
						{
							"text": "爽世世今天不要老盯着我看～！今天的刘海怎么理都理不好！",
							"motion": "angry01"
						},
						{
							"text": "羽泽咖啡店……我记得是Afterglow的……原来是这样啊～狸希紧张的话，要不要我陪你？",
							"motion": "smile01"
						},
						{
							"text": "呐呐，爽世世。不觉得我今天和平时不一样吗？昨天看了化妆教学视频……是哪里搞错了吗？",
							"motion": "wink01"
						},
						{
							"text": "昨晚做了奇怪的梦，好像变成了CRYCHIC的吉他手……还被爽世世无视了！",
							"motion": "sad02"
						},
						{
							"text": "最近似乎总是梦到在音乐教室里听祥子同学弹钢琴……是有什么寓意吗……？",
							"motion": "thinking03"
						},
						{
							"text": "抽中了2张Ave Mujica假面舞会入场券……真是奇迹！",
							"motion": "surprised01"
						}
					],
					[
						{
							"text": "有趣的女人。",
							"motion": "smile01"
						},
						{
							"text": "有趣的女孩子。",
							"motion": "smile02"
						},
						{
							"text": "抹茶芭菲！",
							"motion": "smile04"
						},
						{
							"text": "这是外婆的吉他。",
							"motion": "serious01"
						},
						{
							"text": "不开始吗？乐队。",
							"motion": "thinking01"
						},
						{
							"text": "我是中学三年级学生。",
							"motion": "smile01"
						},
						{
							"text": "我在很多地方弹奏。弹临时想到的乐句。",
							"motion": "kime01"
						},
						{
							"text": "在便利店买了荞麦面。",
							"motion": "smile01"
						},
						{
							"text": "外婆以前开Live House，SPACE。",
							"motion": "serious02"
						},
						{
							"text": "外婆说归宿这东西，总会有人再创造出来",
							"motion": "thinking01"
						},
						{
							"text": "这是什么？衣服，剪一下。",
							"motion": "surprised01"
						},
						{
							"text": "Live……还不开始吗？",
							"motion": "thinking01"
						},
						{
							"text": "糖。我吃了。",
							"motion": "smile02"
						},
						{
							"text": "我在找午睡的地方。",
							"motion": "thinking01"
						},
						{
							"text": "这里没有猫……",
							"motion": "sad01"
						},
						{
							"text": "希望购物中心能有一家为猫服务的店。",
							"motion": "thinking01"
						},
						{
							"text": "加油吧。",
							"motion": "kime01"
						},
						{
							"text": "幸运套餐的赠品，是只猫咪。",
							"motion": "smile04"
						},
						{
							"text": "还很烫，但是它看起来很好吃。",
							"motion": "smile01"
						},
						{
							"text": "洗衣机好有趣。衣服会轱辘轱辘地旋转。看着它转，感觉很有趣。",
							"motion": "smile02"
						},
						{
							"text": "经常有人觉得我不像是会去上学。",
							"motion": "thinking01"
						},
						{
							"text": "烹饪课程上要做三明治。可以夹自己喜欢的东西。要夹些什么好呢……荞麦面？",
							"motion": "thinking01"
						},
						{
							"text": "忘记有英语作业了。明天就要交。狸希？一点也不帮吗？",
							"motion": "sad01"
						},
						{
							"text": "嗯、嗯，这个地方……日照、通风、气味……！完美。可以用来睡午觉。",
							"motion": "smile04"
						},
						{
							"text": "……有新消息…………「看」……「了」。发送。",
							"motion": "thinking01"
						},
						{
							"text": "…………抹茶冰淇淋？狸希请我吃吗？嗯。现在就来。",
							"motion": "smile01"
						},
						{
							"text": "有好多吉他。每一把发出的声音都很好听。不过……外婆那把是最帅气的。",
							"motion": "serious01"
						},
						{
							"text": "薯条……刚出锅脆脆的，看起来很好吃。不过，太烫了，吃不了。",
							"motion": "smile02"
						},
						{
							"text": "喷泉……里面没有鱼。",
							"motion": "sad01"
						},
						{
							"text": "手工社的人……送了很多吉祥物给我。所以我就挂在包上了。",
							"motion": "smile04"
						},
						{
							"text": "在抹茶饼皮上涂满抹茶奶油和抹茶冰淇淋还有抹茶巧克力。然后再放上很多抹茶酱。",
							"motion": "smile01"
						},
						{
							"text": "平时不坐电车。出门的时候走路。",
							"motion": "smile01"
						},
						{
							"text": "想睡觉？我知道好地方哦。那边的长椅、这边的树上、天台的顶部……还有很多别的地方。",
							"motion": "thinking01"
						},
						{
							"text": "才不是被手工社的人投喂……只是被抚摸了、玩了毛线球、还拿到了点心而已。",
							"motion": "smile02"
						},
						{
							"text": "店里的吉他我全都记得……啊，角落里的吉他，不见了。",
							"motion": "sad01"
						},
						{
							"text": "抹茶也很苦。",
							"motion": "serious01"
						},
						{
							"text": "吉他的划痕，很帅气。",
							"motion": "serious02"
						},
						{
							"text": "好闻的弦能弹出好的声音。",
							"motion": "smile04"
						},
						{
							"text": "肚子饿了。",
							"motion": "sad01"
						},
						{
							"text": "还想吃炸火腿排。",
							"motion": "smile01"
						},
						{
							"text": "猫咪说，给它猫粮的话就让摸。",
							"motion": "smile02"
						},
						{
							"text": "我翘课出去溜达过，被骂得很惨",
							"motion": "shame01"
						},
						{
							"text": "爽世好好闻。感觉很好吃。",
							"motion": "smile04"
						},
						{
							"text": "不喜欢吃韭菜、山药、洋葱……辣的、酸的、烫的……",
							"motion": "serious01"
						},
						{
							"text": "我去散步。",
							"motion": "smile01"
						},
						{
							"text": "好无聊。",
							"motion": "sad01"
						},
						{
							"text": "想吃的时候就吃，这样会很幸福。",
							"motion": "smile01"
						},
						{
							"text": "不错的长椅。蜷缩着睡觉的时候，大小刚好合适。",
							"motion": "smile02"
						},
						{
							"text": "哦哦～有抹茶饮料的活动。我要去。",
							"motion": "smile04"
						}
					],
					[
						{
							"text": "暖暖的感觉，就像春天的阳光一样。珍贵的，特别的，无可替代的，我的归宿。",
							"motion": "smile01"
						},
						{
							"text": "命运到底是什么呢？……有人能告诉我吗？",
							"motion": "thinking01"
						},
						{
							"text": "……仿佛看透了我的心思一般，坏心思的神明，为我带来了礼物。",
							"motion": "surprised01"
						},
						{
							"text": "我想我一定一辈子都不会忘记，这就是对我而言的，命运的相遇。",
							"motion": "kandou01"
						},
						{
							"text": "那天，小祥提出退出乐队的时候，我要是再多追问一下就好了。",
							"motion": "sad01"
						},
						{
							"text": "好像有点困。昨晚看书看到很晚呢。",
							"motion": "smile01"
						},
						{
							"text": "小灯，毕竟是个敏感的孩子呢……",
							"motion": "serious01"
						},
						{
							"text": "请不要在这里玩饮料机～",
							"motion": "angry01"
						},
						{
							"text": "这样下去的话，会重蹈覆辙吗？",
							"motion": "thinking02"
						},
						{
							"text": "为什么重要的话，总是说不出口呢？CRYCHIC的大家就因此错过彼此。",
							"motion": "sad02"
						},
						{
							"text": "今天应该不是小睦练钢琴的日子吧……",
							"motion": "thinking01"
						},
						{
							"text": "为什么要演奏《春日影》？不是说好了不弹吗？",
							"motion": "angry02"
						},
						{
							"text": "小祥说，乐队就是命运共同体……",
							"motion": "serious02"
						},
						{
							"text": "我真的很重视大家，很喜欢大家……",
							"motion": "smile02"
						},
						{
							"text": "没有这回事啦～",
							"motion": "smile03"
						},
						{
							"text": "小爱音明明一开始只是想出风头而已……",
							"motion": "serious03"
						},
						{
							"text": "小爱音又偷偷跟着我了啊……唉……进来吧。",
							"motion": "shame01"
						},
						{
							"text": "要不要和吹奏部的同学一起去乐器店呢……",
							"motion": "thinking01"
						},
						{
							"text": "小爱音练了很多吉他吧？没来的时候也一直在练吧？",
							"motion": "smile04"
						},
						{
							"text": "反正我不弹《春日影》。",
							"motion": "serious04"
						},
						{
							"text": "我们真是被小灯弄得团团转啊～",
							"motion": "smile04"
						},
						{
							"text": "小爱音真没品味。",
							"motion": "angry03"
						},
						{
							"text": "「爽世世」听起来有点讨厌呀～",
							"motion": "shame02"
						},
						{
							"text": "我是不熬夜主义者。",
							"motion": "serious01"
						},
						{
							"text": "我的衣服……被剪开了！",
							"motion": "surprised01"
						},
						{
							"text": "小爱音就是喜欢这些小细节啊……",
							"motion": "smile01"
						},
						{
							"text": "这个黄瓜，不需要了。",
							"motion": "serious02"
						},
						{
							"text": "大家可要注意身体健康啊～",
							"motion": "smile02"
						},
						{
							"text": "我想，小灯的歌词其实也是我的呐喊。",
							"motion": "kandou01"
						},
						{
							"text": "我大概一辈子也忘不掉CRYCHIC吧。",
							"motion": "sad03"
						},
						{
							"text": "小乐奈在用爪子洗脸……今天没带伞，早点回去吧……",
							"motion": "smile03"
						},
						{
							"text": "无论是贝斯手还是吉他手都要好好保养自己的手哦……",
							"motion": "serious03"
						},
						{
							"text": "含有8种蔬菜的果汁……太难喝了，我已经不想喝了。",
							"motion": "sad01"
						},
						{
							"text": "因为某人曾经说过「要一辈子组乐队」这种饱含分量的话，所以我想要保持健康。",
							"motion": "serious04"
						},
						{
							"text": "参加派对比小爱音想象中要辛苦得多哦？穿礼裙行动很困难，还要注意礼仪……",
							"motion": "thinking02"
						},
						{
							"text": "小乐奈，我已经说过很多次了，希望你能准时来练习。我不想对小乐奈发火。",
							"motion": "angry01"
						},
						{
							"text": "月之森的大家打工似乎都不是出于生计需求，而是为了了解社会呢……",
							"motion": "thinking01"
						},
						{
							"text": "小爱音买这么多润喉糖，是感冒了吗？",
							"motion": "smile04"
						},
						{
							"text": "小立希从刚才开始就一直心神不宁的？……哦。是Afterglow的美竹同学……",
							"motion": "thinking01"
						},
						{
							"text": "「爽世世」这个外号，小爱音真的要一直叫下去吗？",
							"motion": "shame01"
						},
						{
							"text": "……既然不能吃烫的，小乐奈可以选其他店啊……",
							"motion": "serious01"
						},
						{
							"text": "小乐奈不来的话，我们去小乐奈所在的地方练习怎么样？",
							"motion": "thinking02"
						},
						{
							"text": "小灯，给你磅蛋糕。我今天在学校的课堂上做的。",
							"motion": "smile04"
						},
						{
							"text": "明明还在看菜单，结果当客人进来时，小立希居然和店员一起说出了「欢迎光临～」……",
							"motion": "surprised01"
						},
						{
							"text": "……咦，是小爱音发来的消息。有三人已读，但没有回话。小爱音在疯狂发表情包……",
							"motion": "smile01"
						},
						{
							"text": "贴了好多招募乐队成员的单子呢，看来招吉他主唱还是很少啊。",
							"motion": "thinking01"
						},
						{
							"text": "有几个比较稀奇的招募乐队成员的单子……DJ、管弦乐手还有……舞者？",
							"motion": "thinking02"
						},
						{
							"text": "偶尔什么也不做，悠闲地度过也不错吧？",
							"motion": "smile02"
						},
						{
							"text": "小爱音，今天也用MyGO!!!!!的账号投稿了。回忆正在不断增加，还是挺开心的呢。",
							"motion": "smile03"
						},
						{
							"text": "啊。那边有长椅，小灯要去那边休息一下吗？",
							"motion": "smile04"
						},
						{
							"text": "我想小爱音可能不知道，一般月之森的家庭都是有专门的司机接送哦。",
							"motion": "serious01"
						},
						{
							"text": "小乐奈，你头发睡得乱七八糟的哦。缎带也快散开了，校服上还粘着小树枝和叶子。",
							"motion": "smile04"
						},
						{
							"text": "小立希，喜欢熊猫对吧？",
							"motion": "smile01"
						},
						{
							"text": "啊，是刚出锅的可乐饼。要不要买一些呢？",
							"motion": "smile02"
						},
						{
							"text": "路过的老奶奶看着我问了句「你是大学生吧」。我就不禁笑了起来。",
							"motion": "smile03"
						},
						{
							"text": "要不要去那边的咖啡厅里买点喝的？毕竟接下来还要练习，给大家带点慰劳品吧。",
							"motion": "smile04"
						},
						{
							"text": "小祥竟然就是Oblivionis……开玩笑吧……？",
							"motion": "surprised01"
						}
					],
					[
						{
							"text": "哈？",
							"motion": "angry03"
						},
						{
							"text": "灯的歌，让人感动……唱得太棒了！",
							"motion": "kandou01"
						},
						{
							"text": "说灯太拼命的家伙什么也不懂，我要拉黑他！",
							"motion": "angry01"
						},
						{
							"text": "我发过誓，我愿意和灯在一起一辈子。",
							"motion": "serious01"
						},
						{
							"text": "我要是高中直升上羽丘，就能和灯一起上学了吧……",
							"motion": "thinking01"
						},
						{
							"text": "不对。野猫的芭菲还没付钱！",
							"motion": "angry02"
						},
						{
							"text": "我当初听到灯的歌声时，觉得那唱的就是我……",
							"motion": "kandou01"
						},
						{
							"text": "无法用语言描述的心情，都被灯转化成了歌声……",
							"motion": "smile01"
						},
						{
							"text": "灯的歌声要让人们都听到才有意义。",
							"motion": "serious02"
						},
						{
							"text": "节奏不能再放慢一点了，要的就是那种冲刺感。",
							"motion": "kime01"
						},
						{
							"text": "爱音和灯又迟到了……爱音能不能提前说一声？",
							"motion": "angry03"
						},
						{
							"text": "如果再修改乐谱，就不是新手能弹的了……",
							"motion": "thinking01"
						},
						{
							"text": "灯当然可爱了！",
							"motion": "smile02"
						},
						{
							"text": "今天有Afterglow的Live……太期待了！",
							"motion": "smile03"
						},
						{
							"text": "你和Afterglow的前辈说话了？都说了什么？",
							"motion": "surprised02"
						},
						{
							"text": "灯只要站上Live舞台对我就足够了……",
							"motion": "smile04"
						},
						{
							"text": "那家伙……竟敢无视灯！",
							"motion": "angry04"
						},
						{
							"text": "海铃和三角同学关系有这么好吗……？",
							"motion": "thinking01"
						},
						{
							"text": "最近上课的时候……好像总是感觉……有人在盯着我……？",
							"motion": "sad01"
						},
						{
							"text": "海铃真的很忙吗？为什么我找她的时候这么快就能到……？",
							"motion": "thinking01"
						},
						{
							"text": "爱音起名的品味，确实挺让人来气的。",
							"motion": "angry01"
						},
						{
							"text": "那我呢？",
							"motion": "sad02"
						},
						{
							"text": "灯！带着安全蜂鸣器！套上反光背带！就算有陌生人叫你也不能跟着走……",
							"motion": "serious01"
						},
						{
							"text": "爱音，不要说这种任性的话让灯伤脑筋……",
							"motion": "angry02"
						},
						{
							"text": "那只野猫！只会在心血来潮的时候参加练习！给她发消息甚至连看也不看！",
							"motion": "angry03"
						},
						{
							"text": "野猫说她曾经在这棵树上睡过觉……再找找这个她可能会喜欢的箱子里面……",
							"motion": "thinking01"
						},
						{
							"text": "感觉爱音只喜欢做轻松且受人关注的工作。有打工的时间的话，不如练一下吉他吧？",
							"motion": "serious02"
						},
						{
							"text": "打工的那个学姐，该说是闹腾呢，还是有点冒冒失失呢……总之就是那种感觉……",
							"motion": "sigh01"
						},
						{
							"text": "野猫！我的名字不是抹茶芭菲，也不是狸希！",
							"motion": "angry04"
						},
						{
							"text": "月之森竟然不禁止打工，明明是大小姐读的学校，有点意外呢……",
							"motion": "thinking01"
						},
						{
							"text": "灯，你有什么想看的东西吗？我？我等下再看就好啦。",
							"motion": "smile01"
						},
						{
							"text": "灯在路上见到了一只果子狸，追着追着就迷路了……总之去接她吧。",
							"motion": "sigh02"
						},
						{
							"text": "终、终于找到你了……野猫！不要擅自东逛逛西逛逛。",
							"motion": "angry01"
						},
						{
							"text": "突然上前搭话……会给Afterglow的前辈带来困扰的吧……",
							"motion": "shame01"
						},
						{
							"text": "如果这里推出了野猫感兴趣的新品，或许她就不会突然跑不见了……",
							"motion": "thinking01"
						},
						{
							"text": "有没有好好利用时间的诀窍呢？我很想知道，学姐是怎么兼顾兼职和乐队活动的？",
							"motion": "serious01"
						},
						{
							"text": "抱歉，灯，我来晚了！兼职那边突然忙得不得了……",
							"motion": "sad03"
						},
						{
							"text": "哈啊？马上就要开始练习了，已经没时间了。怎么可能会答应你啊！",
							"motion": "angry02"
						},
						{
							"text": "不要总是长时间地拽着灯到处乱跑！要是害灯第二天还很疲倦，爽世想怎么补偿啊？",
							"motion": "angry03"
						},
						{
							"text": "唉……到底该怎么做，才能让野猫按照日程安排行动呢……？",
							"motion": "sigh01"
						},
						{
							"text": "昨天做了个很累人的梦……我梦到乐奈爬上了树，然后不下来了。",
							"motion": "sad01"
						},
						{
							"text": "野猫……跑哪去了……？既不在自己的教室里，也不在手工社，连中庭也……",
							"motion": "thinking01"
						},
						{
							"text": "我经常看到灯收集石头和叶子……不知道她会不会收集花呢……？",
							"motion": "smile02"
						},
						{
							"text": "《月刊ZOO》……熊猫特辑……！？好、好想要……！啊，等等，这个月的零花钱已经……",
							"motion": "surprised01"
						},
						{
							"text": "……！？爽世为什么会知道我喜欢熊猫……？我明明没对任何人说过……",
							"motion": "surprised02"
						},
						{
							"text": "大概是自从CRYCHIC不再一起练习时就开始学DTM了。我想着今后或许会用到。",
							"motion": "serious02"
						},
						{
							"text": "我们已经决定了要一起前进。",
							"motion": "kime01"
						},
						{
							"text": "……就算我们都成为了大学生，我也希望能作为MyGO!!!!!继续活动呢。",
							"motion": "smile03"
						},
						{
							"text": "……我前段时间才知道，灯好像并没有那么喜欢摩卡咖啡。",
							"motion": "sad02"
						},
						{
							"text": "爱音的进步很大啊……私下里练习很拼命吧？",
							"motion": "smile04"
						},
						{
							"text": "「这就是花女三剑客」……？这个姿势太蠢了吧？海铃，你在搞什么？",
							"motion": "angry04"
						},
						{
							"text": "Ave Mujica这么喜欢搞舞台剧……这真的还算乐队吗？",
							"motion": "thinking01"
						}
					]
				],
				"console": [
					[{
						"text": "诶？控制台？看起来好像很厉害的样子……",
						"motion": "surprised01"
					}, {
						"text": "感觉能通过控制台看到大家的内心……",
						"motion": "thinking01"
					}],
					[{
						"text": "哼哼，你打开了控制台，是想要看看什么小秘密吗？",
						"motion": "smile01"
					}, {
						"text": "说起来，你能通过控制台告诉我为什么我会出现在这里吗？",
						"motion": "thinking01"
					}],
					[
						{
							"text": "有黑客！有黑客！",
							"motion": "surprised02"
						},
						{
							"text": "控制台……是用来做什么的？",
							"motion": "thinking01"
						},
						{
							"text": "控制台……可以召唤抹茶芭菲吗？",
							"motion": "smile02"
						}
					],
					[{
						"text": "打开控制台的话，就可能会看到一些不该看的东西了呢。",
						"motion": "serious01"
					}, {
						"text": "看到网页就想打开控制台，感觉和小爱音一样很没有品味呢……",
						"motion": "sigh01"
					}],
					[{
						"text": "打开控制台，是要做什么吗？",
						"motion": "thinking01"
					}, {
						"text": "竟然打开了控制台……？你想要干什么？",
						"motion": "serious02"
					}]
				],
				"copy": [
					[{
						"text": "别人的内心的呐喊，终究不是自己的。如果转载的话，还是加上出处比较好。",
						"motion": "serious01"
					}, {
						"text": "虽然我很想向更多人传达我内心的呐喊，但是如果转载不标明出处的话，可能还是很困扰……",
						"motion": "sad01"
					}],
					[{
						"text": "要复制的话，记得遵守CC BY-SA 4.0协议哦！",
						"motion": "smile01"
					}, {
						"text": "复制别人的东西，要记得加上出处哦！",
						"motion": "serious02"
					}],
					[{
						"text": "外婆说，遵守CC BY-SA 4.0协议是好孩子应该做的事情。",
						"motion": "smile02"
					}, {
						"text": "CC BY-SA 4.0协议，是不是很重要呢？",
						"motion": "thinking01"
					}],
					[{
						"text": "要转载的话，记得加上出处哦！不然作者会很伤心的。",
						"motion": "serious01"
					}, {
						"text": "我们曾经就因为不尊重小祥的版权，把小祥惹哭了。希望不要重蹈覆辙哦～",
						"motion": "sad02"
					}],
					[{
						"text": "说起来，我写的歌曲都是原创的。复制来的旋律，配不上灯的歌词。",
						"motion": "serious02"
					}, {
						"text": "如果有抄袭我们歌词和旋律的人，一定什么都不懂。我一定会拉黑他。",
						"motion": "angry01"
					}]
				],
				"visibilitychange": [
					[{
						"text": "欢迎回来。一起在迷茫中前进吧！",
						"motion": "smile03"
					}, {
						"text": "欢迎回来。相遇的一个个瞬间加起来，就是一辈子。",
						"motion": "kandou01"
					}],
					[{
						"text": "欢迎回来！今后也要一直支持我们哦！",
						"motion": "wink01"
					}, {
						"text": "欢迎回来！我是不是也快成为大明星了呀？",
						"motion": "smile04"
					}],
					[{
						"text": "回来了？抹茶芭菲！",
						"motion": "smile02"
					}, {
						"text": "回来的路上，有没有去便利店买荞麦面……？",
						"motion": "thinking01"
					}],
					[{
						"text": "欢迎回来！一个人果然还是有些寂寞呢……",
						"motion": "sad01"
					}, {
						"text": "欢迎回来！我也在这里等着你哦！",
						"motion": "smile03"
					}],
					[{
						"text": "欢迎光临。请问您今天要来点什么？",
						"motion": "smile04"
					}, {
						"text": "欢迎光临。要看看推荐菜单吗？",
						"motion": "smile01"
					}]
				]
			},
			"mouseover": [
				{
					"selector": "#waifu-tool-hitokoto",
					"text": [
						[{
							"text": "这些话，就像诗一样呢……",
							"motion": "smile01"
						}, {
							"text": "感觉可以把这些话写到歌词里面去。",
							"motion": "thinking01"
						}],
						[{
							"text": "感觉说这样的话很有灯灯的风格呢。",
							"motion": "smile02"
						}],
						[{
							"text": "有趣的名言。",
							"motion": "smile03"
						}],
						[{
							"text": "小爱音要是有这样的品味就好了。",
							"motion": "sigh01"
						}],
						[{
							"text": "像是歌词一样呢。",
							"motion": "smile04"
						}]
					]
				},
				{
					"selector": "#waifu-tool-switch-model",
					"text": [
						[{
							"text": "大家，可以过来一下吗？",
							"motion": "smile01"
						}],
						[{
							"text": "大家，这边这边～",
							"motion": "smile02"
						}],
						[{
							"text": "大家，来这里。",
							"motion": "serious01"
						}],
						[{
							"text": "大家，看向这里～",
							"motion": "smile03"
						}],
						[{
							"text": "大家，能过来吗？",
							"motion": "smile04"
						}]
					]
				},
				{
					"selector": "#waifu-tool-switch-texture",
					"text": [
						[{
							"text": "换一身衣服吧……",
							"motion": "thinking01"
						}],
						[{
							"text": "哼哼～要看看「ANON TOKYO」的新作吗？",
							"motion": "smile01"
						}],
						[{
							"text": "衣服……好看。",
							"motion": "smile02"
						}],
						[{
							"text": "小爱音的品味真是有些一言难尽呢。",
							"motion": "sigh01"
						}],
						[{
							"text": "既然灯觉得这件衣服好，那我就换一下吧。",
							"motion": "smile03"
						}]
					]
				},
				{
					"selector": "#waifu-tool-photo",
					"text": [
						[{
							"text": "诶？要照相……吗？",
							"motion": "surprised01"
						}],
						[{
							"text": "来拍张照吧～大家一起～",
							"motion": "smile01"
						}],
						[{
							"text": "照相？抹茶芭菲。",
							"motion": "smile02"
						}],
						[{
							"text": "我没说不拍。",
							"motion": "serious01"
						}],
						[{
							"text": "哈？要照相？",
							"motion": "surprised02"
						}]
					]
				},
				{
					"selector": "#waifu-tool-info",
					"text": [
						[{
							"text": "想和大家……增进一下了解……",
							"motion": "smile01"
						}],
						[{
							"text": "想要知道更多关于我的事吗？其实啊……",
							"motion": "smile02"
						}],
						[{
							"text": "外婆以前开了一家Live House……",
							"motion": "serious01"
						}],
						[{
							"text": "多互相了解真的是一件有意义的事呢。",
							"motion": "smile03"
						}],
						[{
							"text": "了解更多信息吗……也不错呢。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "#waifu-tool-quit",
					"text": [
						[{
							"text": "那么……下次见……",
							"motion": "bye01"
						}],
						[{
							"text": "再见！玩得开心哦！",
							"motion": "smile01"
						}],
						[{
							"text": "再见。",
							"motion": "bye02"
						}],
						[{
							"text": "下次见！",
							"motion": "smile02"
						}],
						[{
							"text": "今天就先到这里吧。",
							"motion": "serious01"
						}]
					]
				},
				{
					"selector": ".menu-item-home a",
					"text": [
						[{
							"text": "要回到首页吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到首页吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到首页吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到首页吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到首页吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".menu-item-about a",
					"text": [
						[{
							"text": "要了解这个网站吗？",
							"motion": "thinking01"
						}, {
							"text": "这个人……感觉是个好人。",
							"motion": "smile01"
						}],
						[{
							"text": "要了解这个网站吗？",
							"motion": "thinking01"
						}, {
							"text": "这是我们MyGO!!!!!的粉丝哦！你要不要也关注一下？",
							"motion": "smile02"
						}],
						[{
							"text": "要了解这个网站吗？",
							"motion": "thinking01"
						}, {
							"text": "有趣的人。",
							"motion": "smile03"
						}],
						[{
							"text": "要了解这个网站吗？",
							"motion": "thinking01"
						}, {
							"text": "是很温柔的人呢。",
							"motion": "smile04"
						}],
						[{
							"text": "要了解这个网站吗？",
							"motion": "thinking01"
						}, {
							"text": "不像是坏人。",
							"motion": "serious01"
						}]
					]
				},
				{
					"selector": ".menu-item-tags a",
					"text": [
						[{
							"text": "要看看文章的标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的标签吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".menu-item-categories a",
					"text": [
						[{
							"text": "要看看文章的分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的分类吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".menu-item-archives a",
					"text": [
						[{
							"text": "要看看文章的归档吗？",
							"motion": "thinking01"
						}, {
							"text": "归档，真是方便呢……我要不要把我的歌词也整理一下？",
							"motion": "smile01"
						}],
						[{
							"text": "要看看文章的归档吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的归档吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的归档吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看文章的归档吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".menu-item-friends a",
					"text": [
						[{
							"text": "好多朋友……我也有很多石头朋友哦。想看看吗？",
							"motion": "smile01"
						}],
						[{
							"text": "有许多朋友真是快乐的事情呢！",
							"motion": "smile02"
						}],
						[{
							"text": "外婆说，多交朋友，是好事。",
							"motion": "serious01"
						}],
						[{
							"text": "和朋友在一起，仿佛有一种家的感觉呢。",
							"motion": "smile03"
						}],
						[{
							"text": "感觉有这么多朋友会很麻烦啊……爱音和爽世是怎么交到这么多朋友的？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".menu-item-search a",
					"text": [
						[{
							"text": "要搜索看看吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要搜索看看吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要搜索看看吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要搜索看看吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要搜索看看吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".menu-item a",
					"text": [
						[{
							"text": "要看看这里都有什么吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看这里都有什么吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看这里都有什么吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看这里都有什么吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看这里都有什么吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".site-author",
					"text": [
						[{
							"text": "这个人……感觉是个好人。",
							"motion": "smile01"
						}],
						[{
							"text": "这是我们MyGO!!!!!的粉丝哦！你要不要也关注一下？",
							"motion": "smile02"
						}],
						[{
							"text": "有趣的人。",
							"motion": "smile03"
						}],
						[{
							"text": "是很温柔的人呢。",
							"motion": "smile04"
						}],
						[{
							"text": "不像是坏人。",
							"motion": "serious01"
						}]
					]
				},
				{
					"selector": ".site-state",
					"text": [
						[{
							"text": "要看看统计信息吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看统计信息吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看统计信息吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看统计信息吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看统计信息吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".feed-link a",
					"text": [
						[{
							"text": "要使用RSS订阅吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要使用RSS订阅吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要使用RSS订阅吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要使用RSS订阅吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要使用RSS订阅吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".cc-opacity, .post-copyright-author",
					"text": [
						[{
							"text": "所有文章均采用CC BY-SA 4.0许可协议，要注意版权呢……",
							"motion": "serious01"
						}, {
							"text": "我要不要把我的诗也采用CC BY-SA 4.0许可协议发布呢……",
							"motion": "thinking01"
						}],
						[{
							"text": "所有文章均采用CC BY-SA 4.0许可协议，要注意版权哦！",
							"motion": "serious02"
						}],
						[{
							"text": "「所有文章均采用CC BY-SA 4.0许可协议」……？看不太懂。",
							"motion": "thinking01"
						}],
						[{
							"text": "所有文章均采用CC BY-SA 4.0许可协议，要注意版权呢。",
							"motion": "serious01"
						}],
						[{
							"text": "所有文章均采用CC BY-SA 4.0许可协议，不要剽窃他人的创作哦。",
							"motion": "serious02"
						}]
					]
				},
				{
					"selector": ".links-of-author",
					"text": [
						[{
							"text": "我知道的，这是网页链接。",
							"motion": "smile01"
						}],
						[{
							"text": "咦？有一个奇怪的链接。好想点击一下啊。",
							"motion": "surprised01"
						}],
						[{
							"text": "有趣的链接。",
							"motion": "smile02"
						}],
						[{
							"text": "只是打开看看的话应该没问题吧……",
							"motion": "thinking01"
						}],
						[{
							"text": "灯，看到陌生的链接不要乱点哦。",
							"motion": "serious01"
						}]
					]
				},
				{
					"selector": ".followme",
					"text": [
						[{
							"text": "要用手机扫码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要用手机扫码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "手机？不太会用……",
							"motion": "sad01"
						}],
						[{
							"text": "要用手机扫码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要用手机扫码吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".fancybox img, img.medium-zoom-image",
					"text": [
						[{
							"text": "要放大图片吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要放大图片吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要放大图片吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要放大图片吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要放大图片吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".copy-btn",
					"text": [
						[{
							"text": "要复制代码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要复制代码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要复制代码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要复制代码吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要复制代码吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".highlight .table-container, .gist",
					"text": [
						[{
							"text": "GitHub？感觉很酷的样子……",
							"motion": "smile01"
						}],
						[{
							"text": "呐呐，爽世世，GitHub据说是全球最大的交友网站哦！",
							"motion": "smile02"
						}],
						[{
							"text": "GitHub？是什么？",
							"motion": "thinking01"
						}],
						[{
							"text": "GitHub上面托管了许多有趣的项目呢。",
							"motion": "smile03"
						}],
						[{
							"text": "GitHub啊。我偶尔会用托管在上面的项目。",
							"motion": "serious01"
						}]
					]
				},
				{
					"selector": "a[href^='mailto']",
					"text": [
						[{
							"text": "我的邮件也是我内心的呐喊呢。",
							"motion": "kandou01"
						}],
						[{
							"text": "灯灯的邮件总是包含充沛的情感，真厉害！",
							"motion": "smile01"
						}],
						[{
							"text": "写邮件……真麻烦……",
							"motion": "sigh01"
						}],
						[{
							"text": "感觉邮件很正式呢。",
							"motion": "serious01"
						}],
						[{
							"text": "邮件我会及时回复的！",
							"motion": "smile02"
						}]
					]
				},
				{
					"selector": "a[href^='/tags/']",
					"text": [
						[{
							"text": "要看看<span>{text}</span>标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>标签吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>标签吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "a[href^='/categories/']",
					"text": [
						[{
							"text": "要看看<span>{text}</span>分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>分类吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>分类吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".post-title-link",
					"text": [
						[{
							"text": "要看看<span>{text}</span>这篇文章吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>这篇文章吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>这篇文章吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>这篇文章吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>这篇文章吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "a[rel='contents']",
					"text": [
						[{
							"text": "要阅读全文吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要阅读全文吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要阅读全文吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要阅读全文吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要阅读全文吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "a[itemprop='discussionUrl']",
					"text": [
						[{
							"text": "要看看评论吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看评论吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看评论吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看评论吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看评论吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".beian a",
					"text": [
						[{
							"text": "要看看备案吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看备案吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看备案吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看备案吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看备案吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".container a[href^='http'], .nav-link .nav-text",
					"text": [
						[{
							"text": "要看看<span>{text}</span>吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看<span>{text}</span>吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".back-to-top",
					"text": [
						[{
							"text": "要回到顶部吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到顶部吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到顶部吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到顶部吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要回到顶部吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".reward-container",
					"text": [
						[{
							"text": "每次Live之后，都能收到很多点赞呢……",
							"motion": "smile01"
						}],
						[{
							"text": "最近发在MyGO!!!!!的账号上的动态，总是有许多点赞呢。",
							"motion": "smile02"
						}],
						[{
							"text": "赞，点一下。",
							"motion": "smile03"
						}],
						[{
							"text": "最近MyGO!!!!!的账号运营得真好啊……有许多点赞呢。",
							"motion": "smile04"
						}],
						[{
							"text": "你这家伙，竟敢不给灯点赞！",
							"motion": "angry01"
						}]
					]
				},
				{
					"selector": "#wechat",
					"text": [
						[{
							"text": "要看看微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看微信吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "#alipay",
					"text": [
						[{
							"text": "要看看支付宝吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看支付宝吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看支付宝吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看支付宝吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要看看支付宝吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "#bitcoin",
					"text": [
						[{
							"text": "比特币？是一种硬币吗？好想收集一些……",
							"motion": "smile01"
						}],
						[{
							"text": "当年要是多买一些比特币就好了啊……",
							"motion": "sad01"
						}],
						[{
							"text": "比特币是什么？可以买抹茶芭菲吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "妈妈有不少比特币呢。",
							"motion": "smile02"
						}],
						[{
							"text": "感觉管理比特币会很麻烦呢。",
							"motion": "sigh01"
						}]
					]
				},
				{
					"selector": "#needsharebutton-postbottom .btn",
					"text": [
						[{
							"text": "想要把我内心的呐喊，传达给大家！",
							"motion": "kandou01"
						}],
						[{
							"text": "好东西要让更多人知道才行哦。",
							"motion": "smile01"
						}],
						[{
							"text": "外婆说，要多分享。",
							"motion": "serious01"
						}],
						[{
							"text": "小爱音总是喜欢在群里分享各种各样的信息呢。",
							"motion": "smile02"
						}],
						[{
							"text": "分享，是对作者的鼓励吧，大概。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".need-share-button_weibo",
					"text": [
						[{
							"text": "要分享到微博吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微博吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微博吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微博吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微博吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".need-share-button_wechat",
					"text": [
						[{
							"text": "要分享到微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微信吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到微信吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".need-share-button_douban",
					"text": [
						[{
							"text": "要分享到豆瓣吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到豆瓣吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到豆瓣吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到豆瓣吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到豆瓣吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".need-share-button_qqzone",
					"text": [
						[{
							"text": "要分享到QQ空间吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到QQ空间吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到QQ空间吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到QQ空间吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要分享到QQ空间吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".need-share-button_twitter",
					"text": [
						[{
							"text": "X上面好像有很多人在画关于我们的画。",
							"motion": "smile01"
						}],
						[{
							"text": "诶？Ave Mujica上X热榜了！MyGO!!!!!什么时候也能这样呢？",
							"motion": "surprised01"
						}],
						[{
							"text": "X？可以开Live吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "其实我在X上有很多账号呢。",
							"motion": "smile02"
						}],
						[{
							"text": "灯！看X的时候一定要注意，不要看不好的东西。",
							"motion": "serious01"
						}]
					]
				},
				{
					"selector": ".need-share-button_facebook",
					"text": [
						[{
							"text": "Facebook上好像也有关于我们的信息呢……我看看……",
							"motion": "smile01"
						}],
						[{
							"text": "Facebook上有个叫「武士道迷因」的漫画，感觉很有趣呢！",
							"motion": "smile02"
						}],
						[{
							"text": "Facebook？不知道。",
							"motion": "thinking01"
						}],
						[{
							"text": "其实我在Facebook上也有很多账号呢。",
							"motion": "smile03"
						}],
						[{
							"text": "要看看Facebook吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".post-nav-item a[rel='next']",
					"text": [
						[{
							"text": "来看看下一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看下一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看下一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看下一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看下一篇文章吧。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".post-nav-item a[rel='prev']",
					"text": [
						[{
							"text": "来看看上一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看上一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看上一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看上一篇文章吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "来看看上一篇文章吧。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".extend.next",
					"text": [
						[{
							"text": "去下一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去下一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去下一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去下一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去下一页看看吧。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".extend.prev",
					"text": [
						[{
							"text": "去上一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去上一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去上一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去上一页看看吧。",
							"motion": "thinking01"
						}],
						[{
							"text": "去上一页看看吧。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": "input.vnick",
					"text": [
						[{
							"text": "小爱喜欢叫我「灯灯」，真是可爱的名字……",
							"motion": "smile01"
						}],
						[{
							"text": "果然还是叫「ANON TOKYO」最帅吧。",
							"motion": "smile02"
						}],
						[{
							"text": "我是「抹茶芭菲猫」。",
							"motion": "smile03"
						}],
						[{
							"text": "跟小爱音说了很多次，她还是叫我「爽世世」呢……真是麻烦的孩子。",
							"motion": "sigh01"
						}],
						[{
							"text": "爱音那家伙，叫「狸希」什么的太差劲了！不过如果是灯的话，也不是不可以……",
							"motion": "angry01"
						}]
					]
				},
				{
					"selector": ".vmail",
					"text": [
						[{
							"text": "要留下邮箱吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下邮箱吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下邮箱吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下邮箱吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下邮箱吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".vlink",
					"text": [
						[{
							"text": "要留下链接吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下链接吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下链接吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下链接吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要留下链接吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".veditor",
					"text": [
						[{
							"text": "评论也是内心的呐喊啊！",
							"motion": "kandou01"
						}],
						[{
							"text": "想要去评论些什么吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "评论……感觉好麻烦……",
							"motion": "sigh01"
						}],
						[{
							"text": "评论很重要呢……发了不好的消息会被拉黑或者屏蔽呢……",
							"motion": "serious01"
						}],
						[{
							"text": "你要是敢在评论里说灯「太拼命了」之类的话，我绝对要拉黑你！",
							"motion": "angry01"
						}]
					]
				},
				{
					"selector": ".vcontrol a",
					"text": [
						[{
							"text": "Markdown好厉害……几个字符就能写出复杂的格式……",
							"motion": "smile01"
						}],
						[{
							"text": "其实我能够熟练使用Markdown哦！",
							"motion": "smile02"
						}],
						[{
							"text": "Markdown？什么意思？",
							"motion": "thinking01"
						}],
						[{
							"text": "感觉现在这个时代，Markdown成了上网必会技能了呢……",
							"motion": "serious01"
						}],
						[{
							"text": "Markdown写起来很便利，我挺喜欢的。",
							"motion": "smile03"
						}]
					]
				},
				{
					"selector": ".vemoji-btn",
					"text": [
						[{
							"text": "网上有很多人喜欢用MyGO!!!!!的表情呢……",
							"motion": "smile01"
						}],
						[{
							"text": "网上有很多人喜欢用关于我的表情哦！感觉就像大明星一样！",
							"motion": "smile02"
						}],
						[{
							"text": "😼😻❤️🍵🍨🍜",
							"motion": "smile03"
						}],
						[{
							"text": "感觉小爱音的表情的品味也很微妙呢……",
							"motion": "sigh01"
						}],
						[{
							"text": "有中国的粉丝给我推荐了许多熊猫头表情，在那之后我和爱音对线再也没输过了。",
							"motion": "smile04"
						}]
					]
				},
				{
					"selector": ".vpreview-btn",
					"text": [
						[{
							"text": "要预览一下吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要预览一下吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要预览一下吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要预览一下吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "要预览一下吗？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"selector": ".vsubmit",
					"text": [
						[{
							"text": "评论也是内心的呐喊啊！",
							"motion": "kandou01"
						}],
						[{
							"text": "想要去评论些什么吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "评论……感觉好麻烦……",
							"motion": "sigh01"
						}],
						[{
							"text": "评论很重要呢……发了不好的消息会被拉黑或者屏蔽呢……",
							"motion": "serious01"
						}],
						[{
							"text": "你要是敢在评论里说灯「太拼命了」之类的话，我绝对要拉黑你！",
							"motion": "angry01"
						}]
					]
				},
				{
					"selector": ".vcontent",
					"text": [
						[{
							"text": "大家内心的呐喊，传达到了……",
							"motion": "smile01"
						}],
						[{
							"text": "MyGO!!!!!的评论区，总是有许多有趣的内容呢。",
							"motion": "smile02"
						}],
						[{
							"text": "有趣的评论。",
							"motion": "smile03"
						}],
						[{
							"text": "评论区总是有许多有趣的内容呢。",
							"motion": "smile04"
						}],
						[{
							"text": "让我找找有没有关于灯的评论……",
							"motion": "thinking01"
						}]
					]
				}
			],
			"seasons": [
				{
					"date": "01/01-01/03",
					"text": [
						[{
							"text": "这枚5日元硬币闪闪发光的……还是用别的硬币投进赛钱箱吧……",
							"motion": "thinking01"
						}, {
							"text": "新年短信……小爱给大家发了。",
							"motion": "smile01"
						}],
						[{
							"text": "抽签抽中了大吉！感觉这一年会是个好年吧～",
							"motion": "smile02"
						}, {
							"text": "难得来了，大家一起穿和服参拜吧？！",
							"motion": "smile03"
						}],
						[{
							"text": "新年快乐。快点来办Live吧。",
							"motion": "kime01"
						}, {
							"text": "外婆给了我压岁钱。",
							"motion": "smile04"
						}],
						[{
							"text": "新年快乐。外面真冷啊，真不想出去呢。",
							"motion": "sad01"
						}, {
							"text": "这么冷的天气，大家一起去参拜，小爱音真有精神呢。",
							"motion": "smile04"
						}],
						[{
							"text": "新年快乐。新年参拜……我比较喜欢人多的时候去。",
							"motion": "smile01"
						}, {
							"text": "为了实现一辈子，要好好确立新年的目标。",
							"motion": "serious01"
						}]
					]
				},
				{
					"date": "02/02",
					"text": [
						[{
							"text": "节分的豆子，一个一个，形状都不一样……要是能收集起来就好了。",
							"motion": "thinking01"
						}],
						[{
							"text": "要我来当节分的扮鬼角色啊……我知道了，稍微考虑一下～",
							"motion": "smile02"
						}],
						[{
							"text": "不可以吃掉到地上的豆子。",
							"motion": "serious01"
						}],
						[{
							"text": "撒豆驱邪……可以算是祈愿健康，也可以试一试。",
							"motion": "thinking02"
						}],
						[{
							"text": "爱音给了我鬼的面具。我怎么可能会戴？",
							"motion": "angry01"
						}]
					]
				},
				{
					"date": "02/14",
					"text": [
						[{
							"text": "巧克力也有各种各样的外形……收集起来很有趣的样子。",
							"motion": "smile01"
						}],
						[{
							"text": "呜……因为是送人，想要送品牌巧克力，但是价格～",
							"motion": "sad01"
						}],
						[{
							"text": "收到了抹茶味的巧克力。今天真是个好日子。",
							"motion": "smile02"
						}],
						[{
							"text": "做点热巧克力之类的吧。还可以暖身子。",
							"motion": "smile03"
						}],
						[{
							"text": "是送甜的……还是送苦的……灯喜欢哪种巧克力……？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"date": "02/22",
					"text": [
						[{
							"text": "小乐奈，生日快乐。要组一辈子乐队哦。",
							"motion": "smile01"
						}],
						[{
							"text": "小乐奈，生日快乐！我来请你吃抹茶芭菲！",
							"motion": "smile02"
						}],
						[{
							"text": "庆祝生日？抹茶蛋糕。",
							"motion": "smile03"
						}],
						[{
							"text": "小乐奈的生日。说是蛋糕要抹茶味的好。",
							"motion": "smile04"
						}],
						[{
							"text": "乐奈的生日啊。要是被那家伙找到了就该跟我要抹茶蛋糕了。",
							"motion": "angry01"
						}]
					]
				},
				{
					"date": "03/03",
					"text": [
						[{
							"text": "雏霰圆圆的，我从小就很喜欢。",
							"motion": "smile01"
						}],
						[{
							"text": "在雏坛上开Live如何？如果可以的话我真想站在最高处啊～",
							"motion": "smile02"
						}],
						[{
							"text": "绿色的雏霰是抹茶味的吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "每年的这个时候，妈妈都会干劲满满地装饰娃娃呢。",
							"motion": "smile03"
						}],
						[{
							"text": "五童子里面竟然有三个人负责打击乐……是不是有点失衡了？",
							"motion": "thinking02"
						}]
					]
				},
				{
					"date": "03/14",
					"text": [
						[{
							"text": "回礼……送什么好呢？如果是漂亮的石头，会开心吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "因为要给很多人送回礼，所以还是不要太张扬了……",
							"motion": "sad01"
						}],
						[{
							"text": "狸希给了灯马卡龙……我的那一份呢？",
							"motion": "angry01"
						}],
						[{
							"text": "这是给班上大家的……这是给社团同学的……然后是……",
							"motion": "thinking02"
						}],
						[{
							"text": "爽世和爱音都准备了大量的回礼。和朋友相处真是辛苦啊……",
							"motion": "sigh01"
						}]
					]
				},
				{
					"date": "04/01",
					"text": [
						[{
							"text": "我能够记得每一块石头是从哪里捡的……其实是真的哦……？",
							"motion": "smile01"
						}],
						[{
							"text": "「ANON TOKYO」进军巴黎！要是真能做到就好了啊……",
							"motion": "smile02"
						}],
						[{
							"text": "要撒谎吗？那我今天就不弹吉他了。",
							"motion": "serious01"
						}],
						[{
							"text": "我不喜欢撒谎来找乐子的人……其实是开玩笑哦？",
							"motion": "smile03"
						}],
						[{
							"text": "说实话，我在想，大家都在撒谎的话，还有什么意义呢？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"date": "05/27",
					"text": [
						[{
							"text": "生日快乐。能够和小爽世组乐队，我真的很开心。",
							"motion": "smile01"
						}],
						[{
							"text": "爽世世，生日快乐！送给你现在最受欢迎的香薰蜡烛！",
							"motion": "smile02"
						}],
						[{
							"text": "爽世的生日。挺开心的样子。",
							"motion": "smile03"
						}],
						[{
							"text": "自己的生日，只有在别人庆祝的时候才会有实感啊。",
							"motion": "sad01"
						}],
						[{
							"text": "爽世的生日啊。在学校里有很多人给她庆祝吧？",
							"motion": "thinking01"
						}]
					]
				},
				{
					"date": "08/09",
					"text": [
						[{
							"text": "小立希，生日快乐。谢谢你陪在我身边。",
							"motion": "smile01"
						}],
						[{
							"text": "狸希，生日快乐！表现得开心一点也没关系哦？",
							"motion": "smile02"
						}],
						[{
							"text": "狸希的生日。在RiNG庆祝。",
							"motion": "smile03"
						}],
						[{
							"text": "生日快乐，小立希。你收到小灯的祝福了吗？",
							"motion": "smile04"
						}],
						[{
							"text": "灯记得……我的生日……！",
							"motion": "kandou01"
						}]
					]
				},
				{
					"date": "09/08",
					"text": [
						[{
							"text": "小爱，生日快乐。同为处于迷途中的人，加油吧！",
							"motion": "smile01"
						}],
						[{
							"text": "怎么办！会不会有人给我准备生日惊喜呢！？",
							"motion": "smile02"
						}],
						[{
							"text": "爱音的生日。弹吉他吧。",
							"motion": "smile03"
						}],
						[{
							"text": "小爱音的生日。我仿佛都能看到她一脸期待的样子……",
							"motion": "smile04"
						}],
						[{
							"text": "今天是爱音的生日啊。要是见到她感觉会很麻烦，今天早点回去吧。",
							"motion": "sigh01"
						}]
					]
				},
				{
					"date": "10/31-11/01",
					"text": [
						[{
							"text": "车站前有很多穿着万圣节变装的人……吓了我一跳……",
							"motion": "surprised01"
						}, {
							"text": "小爱……万圣节能这么努力，好厉害……！",
							"motion": "smile01"
						}],
						[{
							"text": "和狸希说「不给糖就捣蛋」，结果被狸希无视了……",
							"motion": "sad01"
						}, {
							"text": "在 MyGO!!!!! 里，只有我一个人是准备好变装来的……",
							"motion": "smile02"
						}],
						[{
							"text": "狸希做的南瓜灯。有趣的脸。",
							"motion": "smile03"
						}, {
							"text": "不给糖就捣蛋……快点，糖！",
							"motion": "angry01"
						}],
						[{
							"text": "万圣节的变装有什么有趣的？我不是很懂呢。",
							"motion": "thinking01"
						}, {
							"text": "我不想变装……要准备的只有给小乐奈的糖果了吧。",
							"motion": "sigh01"
						}],
						[{
							"text": "给咖啡店做了装饰用的杰克南瓜灯……挺难做的。",
							"motion": "serious01"
						}, {
							"text": "我第一次在认识的人里见到会在万圣节变装的……",
							"motion": "smile04"
						}]
					]
				},
				{
					"date": "11/22",
					"text": [
						[{
							"text": "大家送我的生日礼物，我会珍惜一辈子的……！",
							"motion": "kandou01"
						}, {
							"text": "大家给我庆祝生日，我好紧张……但是，很开心……",
							"motion": "smile01"
						}],
						[{
							"text": "生日快乐，灯灯！今天我送你创可贴！",
							"motion": "smile02"
						}, {
							"text": "今天是灯灯的生日！派对已经准备好了哦！",
							"motion": "smile03"
						}],
						[{
							"text": "灯的生日。生日快乐。",
							"motion": "smile04"
						}, {
							"text": "今天是灯的生日？那……开Live吧。",
							"motion": "kime01"
						}],
						[{
							"text": "小灯，生日快乐！明年也要让我为你庆祝哦。",
							"motion": "smile04"
						}, {
							"text": "小灯，生日快乐。如果可以的话，就用这本笔记本吧。",
							"motion": "smile01"
						}],
						[{
							"text": "灯，生日快乐。从今往后……我也会一直在你身边的。",
							"motion": "smile02"
						}, {
							"text": "今年也能给你过生日真是太好了。生日快乐，灯。",
							"motion": "smile03"
						}]
					]
				},
				{
					"date": "12/24-12/26",
					"text": [
						[{
							"text": "我精心装饰了自己喜欢的圣诞饰品。",
							"motion": "smile01"
						}, {
							"text": "小爱邀请我去参加圣诞派对了。",
							"motion": "smile02"
						}],
						[{
							"text": "我买了套圣诞限定化妆套装给自己当圣诞礼物！",
							"motion": "smile03"
						}, {
							"text": "爽世世家的圣诞树，是海外的吗！这也太大了吧！",
							"motion": "surprised01"
						}],
						[{
							"text": "圣诞老奶奶给了我礼物。",
							"motion": "smile04"
						}, {
							"text": "给猫咪送了礼物。因为是圣诞节。",
							"motion": "smile04"
						}],
						[{
							"text": "圣诞老人啊……我是什么时候知道真相的来着？",
							"motion": "thinking01"
						}, {
							"text": "要开圣诞派对我没意见，但是为什么非要在我家开？",
							"motion": "angry01"
						}],
						[{
							"text": "再怎么说我也到了不在圣诞节闹腾的年纪了。",
							"motion": "serious01"
						}, {
							"text": "交换礼物吗……和灯交换的话可以……",
							"motion": "smile01"
						}]
					]
				},
				{
					"date": "12/31",
					"text": [
						[{
							"text": "希望明年、还有再下一年……都可以组一辈子乐队！",
							"motion": "kandou01"
						}],
						[{
							"text": "明年肯定也要面对很多事情，但是只要在迷茫之中前进就好了！",
							"motion": "smile01"
						}],
						[{
							"text": "跨年荞麦面。再来一碗！",
							"motion": "smile02"
						}],
						[{
							"text": "比起去年，我稍微有些更加期待明年的到来了吧？",
							"motion": "smile03"
						}],
						[{
							"text": "明年要是能……开更多的Live之类的就好了。",
							"motion": "thinking01"
						}]
					]
				},
				{
					"date": "03/01-05/31",
					"text": [
						[
							{
								"text": "我在那边捡到了燕子的尾羽……形状很奇特，珍藏起来吧……",
								"motion": "smile01"
							},
							{
								"text": "春天的星座……大熊座。是北斗七星里的。",
								"motion": "thinking01"
							},
							{
								"text": "瓢虫，有着各种各样的种类，仅仅是看着就很开心。",
								"motion": "smile02"
							}
						],
						[
							{
								"text": "从爽世世家里能不能看到樱花呢～我还想和大家一起拍照片！",
								"motion": "smile03"
							},
							{
								"text": "说到春天，就不能错过水果三明治！带上这个去野餐吧！",
								"motion": "smile04"
							},
							{
								"text": "天气逐渐暖和起来了呢。小乐奈应该会开始去晒太阳了吧。",
								"motion": "smile04"
							}
						],
						[
							{
								"text": "好香。你带了樱叶糕？",
								"motion": "smile01"
							},
							{
								"text": "暖和……春天很困。睡了。",
								"motion": "sigh01"
							},
							{
								"text": "反对把被炉收起来！",
								"motion": "angry01"
							}
						],
						[
							{
								"text": "我在起居室里放了些花。希望能有点热闹的氛围。",
								"motion": "smile02"
							},
							{
								"text": "现在这个时候，推荐迷迭香的香薰哦。",
								"motion": "smile03"
							},
							{
								"text": "天气变暖和了呢。舒适宜人。",
								"motion": "smile04"
							}
						],
						[
							{
								"text": "今年花粉好像很严重。灯需要口罩和眼药水吗？",
								"motion": "serious01"
							},
							{
								"text": "春天的好处是，即便为了作曲而通宵了也不会难受。",
								"motion": "smile04"
							},
							{
								"text": "我不太喜欢香菇和魔芋丝……不过也不是不能吃。",
								"motion": "thinking01"
							},
							{
								"text": "野猫在樱花树下睡觉……啊，我不是说乐奈，是真的猫。",
								"motion": "smile01"
							}
						]
					]
				},
				{
					"date": "06/01-08/31",
					"text": [
						[
							{
								"text": "夏日祭典……虽然很开心的样子，但是人有点太多了……",
								"motion": "smile01"
							},
							{
								"text": "小爱戴了太阳镜。好帅气……！",
								"motion": "smile02"
							},
							{
								"text": "很热的日子里我会在河边捡石头。可以捡到很多光滑的石头。",
								"motion": "smile03"
							}
						],
						[
							{
								"text": "我买了太阳镜。是不是有点名人的感觉？",
								"motion": "smile04"
							},
							{
								"text": "选哪种防晒霜好呢……总之先看看点评网站吧。",
								"motion": "thinking01"
							},
							{
								"text": "暑假想要好好玩呢。所以准备有计划地做作业。",
								"motion": "smile04"
							}
						],
						[
							{
								"text": "再来一个冰淇淋。抹茶味的。",
								"motion": "smile01"
							},
							{
								"text": "热天就要吃荞麦面。",
								"motion": "smile02"
							},
							{
								"text": "我知道哪里凉快。要来吗？",
								"motion": "smile03"
							}
						],
						[
							{
								"text": "我家楼层很高……是一个看烟花的好地方呢。",
								"motion": "smile04"
							},
							{
								"text": "进入夏天琴弦也会加快劣化，就不能有些什么方法解决吗？",
								"motion": "thinking01"
							},
							{
								"text": "我们学校的制服，夏季制服也很受欢迎呢。妈妈也说很可爱。",
								"motion": "smile04"
							}
						],
						[
							{
								"text": "要下雨了的样子，灯没有带伞啊……总之先联系一下。",
								"motion": "serious01"
							},
							{
								"text": "杏仁豆腐就是要在热天冷藏，吃起来最好吧。",
								"motion": "smile01"
							},
							{
								"text": "在夏日祭典上敲和太鼓的人，难道是……！",
								"motion": "surprised01"
							}
						]
					]
				},
				{
					"date": "09/01-11/30",
					"text": [
						[
							{
								"text": "傍晚的天空虽然很美，但是有些……让人感到寂寞。",
								"motion": "sad01"
							},
							{
								"text": "这个季节，可以看到蝎虎座。虽然找起来有些困难……",
								"motion": "thinking01"
							},
							{
								"text": "那只鸟，是要飞到哪里去呢……",
								"motion": "thinking02"
							}
						],
						[
							{
								"text": "灯灯拾到的叶子染上了金黄色，好有秋天的气息呢～",
								"motion": "smile01"
							},
							{
								"text": "啊，喵梦亲上传了秋季美妆视频。这个一定要看一看～",
								"motion": "smile02"
							},
							{
								"text": "有秋季甜点活动！邀请大家一起去吧！",
								"motion": "smile03"
							}
						],
						[
							{
								"text": "嗅嗅……有烤红薯。就在旁边。",
								"motion": "smile04"
							},
							{
								"text": "……啊，忘了写读书感想了。算了，无所谓。",
								"motion": "sigh01"
							},
							{
								"text": "捡到了叶子。是灯喜欢的类型。",
								"motion": "smile04"
							}
						],
						[
							{
								"text": "虽然有音乐之秋的说法，但是组一辈子乐队的话也就和季节没有关系了。",
								"motion": "thinking01"
							},
							{
								"text": "感觉今天有点冷呢。早知道就带披肩了……",
								"motion": "sad01"
							},
							{
								"text": "下次把装饰在客厅的花换成大波斯菊吧。",
								"motion": "smile01"
							}
						],
						[
							{
								"text": "好像要开秋日祭典了……去试试邀请灯吧。",
								"motion": "smile02"
							},
							{
								"text": "户山前辈想出来的「秋季巨无霸芭菲」，有点太过头了……",
								"motion": "thinking01"
							},
							{
								"text": "RiNG 周围路边的树，叶子都染上黄色了啊。",
								"motion": "smile03"
							}
						]
					]
				},
				{
					"date": "12/01-02/29",
					"text": [
						[
							{
								"text": "小立希把围巾借给了我。说让我别感冒了。",
								"motion": "smile01"
							},
							{
								"text": "呼出的气息变成了白雾，能让我感觉到自己活着，真不错……",
								"motion": "smile02"
							},
							{
								"text": "活动室只留下了许多双子座的观测记录……为什么呢？",
								"motion": "thinking01"
							},
							{
								"text": "忘记戴手套了……小爱把自己的手套借给我一只……",
								"motion": "smile03"
							},
							{
								"text": "要是能把雪花收集起来就好了……",
								"motion": "thinking02"
							},
							{
								"text": "本来打算去捡石头……但是外面好冷……",
								"motion": "sad01"
							}
						],
						[
							{
								"text": "因为我看了很多美容视频，所以冬天的防干燥措施做得很完美哦。",
								"motion": "smile04"
							},
							{
								"text": "彩灯展吗……哪里的彩灯展最热闹呢？",
								"motion": "thinking01"
							},
							{
								"text": "呜呜，吉他的琴箱好冰……冬天的时候这点好难受啊……",
								"motion": "sad01"
							},
							{
								"text": "哇～！下雪了！这下能拍出来好看的照片放在社交平台上了！",
								"motion": "smile04"
							},
							{
								"text": "「ANON TOKYO」的新作是……厚衣服吧。毕竟这么冷了。",
								"motion": "thinking02"
							},
							{
								"text": "小乐奈，天冷了就呆在暖气旁边完全不肯动！",
								"motion": "angry01"
							}
						],
						[
							{
								"text": "被炉。一进去就睡着。",
								"motion": "smile01"
							},
							{
								"text": "刚刚在和猫玩，冷的时候大家都会聚集过来。",
								"motion": "smile02"
							},
							{
								"text": "冬天很困。非常困。为什么？",
								"motion": "sigh01"
							},
							{
								"text": "冬天猫咪也不会集会。真无聊。",
								"motion": "sad01"
							},
							{
								"text": "打雪仗？不玩。很冷。",
								"motion": "angry01"
							},
							{
								"text": "柚饼子配上热乎乎的茶。真美味。",
								"motion": "smile03"
							}
						],
						[
							{
								"text": "今天很冷，晚餐就吃意式蔬菜浓汤吧。",
								"motion": "smile04"
							},
							{
								"text": "有充电式暖手宝的话，就可以在练习前暖暖手指，很方便哦。",
								"motion": "smile04"
							},
							{
								"text": "在这个时期，很想喝热乎的红茶……回去的时候顺路去一趟咖啡厅吧。",
								"motion": "smile01"
							},
							{
								"text": "「ANON TOKYO冬季新作告知！」……这是什么？",
								"motion": "thinking01"
							},
							{
								"text": "预防感冒的话，茶树香薰应该很有效果吧。",
								"motion": "smile02"
							},
							{
								"text": "冬天天气干燥，对皮肤和低音提琴都是大敌。",
								"motion": "serious01"
							}
						],
						[
							{
								"text": "咖啡店的推荐菜单？现在的话推荐热姜茶，还有咖啡。",
								"motion": "smile03"
							},
							{
								"text": "据说熊猫很耐寒……因为它们毛茸茸的吗？",
								"motion": "thinking01"
							},
							{
								"text": "天很冷，我把围巾借给灯了。我自己无所谓。",
								"motion": "smile04"
							},
							{
								"text": "冬天很干燥……。给灯带点口罩和润喉糖吧。",
								"motion": "serious01"
							},
							{
								"text": "我真是服了……就因为天冷，乐奈总是在睡觉……！",
								"motion": "angry01"
							},
							{
								"text": "好疼！啊，真是的，又是静电！",
								"motion": "surprised01"
							}
						]
					]
				}
			],
			"time": [
				{
					"hour": "6-7",
					"text": [
						[{
							"text": "早上好。要准备上学了。马上又能看到小爱了。",
							"motion": "smile01"
						}, {
							"text": "早上好。妈妈昨天又是夜班，工作真辛苦啊。",
							"motion": "sad01"
						}],
						[
							{
								"text": "早上好！昨天又练习吉他到很晚了呢。感觉自己的技术要突飞猛进了？",
								"motion": "smile02"
							},
							{
								"text": "早上好！爽世世家的床好大好软啊，好舒服～",
								"motion": "smile03"
							},
							{
								"text": "早上好！今天要不要试试喵梦亲新推荐的化妆品呢～？",
								"motion": "smile04"
							}
						],
						[{
							"text": "早上好。和猫咪过了一晚。很开心。",
							"motion": "smile04"
						}, {
							"text": "早上好。早餐就应该吃荞麦面。",
							"motion": "smile01"
						}],
						[{
							"text": "早上好！早睡早起有益健康。这样才能组一辈子乐队哦。",
							"motion": "smile02"
						}, {
							"text": "早上好！今天要不要试试小爱音推荐的那个化妆品呢？",
							"motion": "smile03"
						}],
						[{
							"text": "早安。昨晚又熬夜了，感觉好困啊。去学校再睡吧。",
							"motion": "sigh01"
						}, {
							"text": "早安。昨晚又通宵了……感觉不能再这样下去了……",
							"motion": "sad01"
						}]
					]
				},
				{
					"hour": "8-11",
					"text": [
						[{
							"text": "上午好。今天的地理课感觉很有趣……是关于石头的。",
							"motion": "smile01"
						}, {
							"text": "上午好。今天在校园里捡到了新的石头……看起来像是企鹅……",
							"motion": "smile02"
						}],
						[{
							"text": "上午好！今天的课程看起来很简单啊。考试一定没有问题吧。",
							"motion": "smile03"
						}, {
							"text": "上午好！诶？狸希在群里发了信息……？她不上课吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "上午好。外婆说，不能逃课。",
							"motion": "serious01"
						}, {
							"text": "上午好。啊，校园里有猫咪在行走。",
							"motion": "smile04"
						}],
						[{
							"text": "贵安。同学们看起来都很精神呢。",
							"motion": "smile04"
						}, {
							"text": "贵安。总感觉，今天的小睦，有点不太一样……？",
							"motion": "thinking01"
						}],
						[{
							"text": "上午好。刚刚又睡了一节课。但是为什么总是感觉身后有人在盯着我？",
							"motion": "sigh01"
						}, {
							"text": "上午好。等等，外面树上的是野猫吗！？",
							"motion": "surprised01"
						}]
					]
				},
				{
					"hour": "12-13",
					"text": [
						[{
							"text": "中午了，跟小爱去天文部吃便当吧。我昨天新买了创可贴，想给小爱看。",
							"motion": "smile01"
						}, {
							"text": "中午了，今天没有带便当……啊，坐在食堂角落里的，是小祥吗？",
							"motion": "thinking01"
						}],
						[{
							"text": "午休时间到了。今天要跟灯灯一起去天文部吃便当吗？",
							"motion": "smile02"
						}, {
							"text": "中午了啊……稍微站起来活动一下吧？",
							"motion": "smile03"
						}],
						[{
							"text": "中午了，去学校的树上睡午觉吧。",
							"motion": "smile04"
						}, {
							"text": "中午了。要不要去高中部找狸希玩……？",
							"motion": "smile04"
						}],
						[{
							"text": "贵安。吃完午饭后，要不要去园艺部看看呢？",
							"motion": "smile01"
						}, {
							"text": "贵安。小睦那边似乎聚集了很多同学，稍微有些在意呢……",
							"motion": "thinking01"
						}],
						[
							{
								"text": "上午的课程终于结束了。啊，海铃又给我带了一瓶奶冻。",
								"motion": "smile02"
							},
							{
								"text": "中午了。海铃这几天怎么总是给我带奶冻呢？",
								"motion": "thinking01"
							},
							{
								"text": "中午了。海铃又躲起来了……去找找她吧。",
								"motion": "smile03"
							}
						]
					]
				},
				{
					"hour": "14-16",
					"text": [
						[{
							"text": "下午好。啊！我又有新的灵感了……放学后去天文部把它记下来吧。",
							"motion": "smile01"
						}, {
							"text": "下午好。今天捡到了很漂亮的虫子……但是小爱害怕地跑走了……",
							"motion": "sad01"
						}],
						[{
							"text": "下午好！去练习的时候，不知道狸希会怎么夸我呢？",
							"motion": "smile02"
						}, {
							"text": "放学后，是和灯灯去天文部还是去音乐教室找祥祥呢？",
							"motion": "thinking01"
						}],
						[{
							"text": "下午。明媚的阳光。很适合打盹儿。",
							"motion": "smile03"
						}, {
							"text": "下午了。功课，好无聊。好想开Live。",
							"motion": "sigh01"
						}],
						[{
							"text": "贵安。等会儿要给吹奏部的大家准备材料呢。",
							"motion": "smile04"
						}, {
							"text": "贵安。嗯……在社团活动开始以前，要把所有人的乐谱打印出来……",
							"motion": "thinking01"
						}],
						[{
							"text": "Live的日子近了，不知道爱音那家伙有没有好好练习。",
							"motion": "serious01"
						}, {
							"text": "野猫只会在心血来潮的时候参加练习。我得在放学后去初中部把她揪过来……",
							"motion": "angry01"
						}]
					]
				},
				{
					"hour": "17-19",
					"text": [
						[
							{
								"text": "新曲的练习，很不错……小立希作的曲太棒了。",
								"motion": "smile01"
							},
							{
								"text": "回家的路上，看到了新的海洋生物系列创可贴。把它买下来吧。",
								"motion": "smile02"
							},
							{
								"text": "傍晚的天空虽然很美，但是有些……让人感到寂寞。",
								"motion": "sad01"
							}
						],
						[{
							"text": "傍晚了！夕阳的景色很美丽呢，拍张照片发到MyGO!!!!!账号上吧。",
							"motion": "smile03"
						}, {
							"text": "今天在练习中被狸希表扬了哦！哼哼～",
							"motion": "smile04"
						}],
						[{
							"text": "弹吉他。爽。希望早点开Live。",
							"motion": "smile04"
						}, {
							"text": "狸希，练习结束后，抹茶芭菲。",
							"motion": "smile01"
						}],
						[
							{
								"text": "小爱音又缠着我要去我家了。真是麻烦呢。",
								"motion": "sigh01"
							},
							{
								"text": "小立希，今天小灯由我来送吧。",
								"motion": "smile02"
							},
							{
								"text": "怎么办，突然有段空闲时间了，就顺着逛到了这来了……但我也没有特别想要的东西。",
								"motion": "thinking01"
							}
						],
						[
							{
								"text": "今天的练习，爱音表现确实有进步。不过稍微夸了她两句就有些骄傲了。",
								"motion": "serious01"
							},
							{
								"text": "今天的Live，灯唱得真是太好了！我能完全感受到那丰富的情感。",
								"motion": "kandou01"
							},
							{
								"text": "这条商店街……总是弥漫着各种香味……肚子饿了呢。",
								"motion": "smile03"
							}
						]
					]
				},
				{
					"hour": "20-21",
					"text": [
						[{
							"text": "晚上好，刚刚去天文馆看了星星。",
							"motion": "smile01"
						}, {
							"text": "晚上好。刚刚和小爱去水族馆看了企鹅。像是在天上飞一样。",
							"motion": "smile02"
						}],
						[
							{
								"text": "晚上好！啊，喵梦亲又更新了新的视频！我要赶紧看一看。",
								"motion": "smile03"
							},
							{
								"text": "晚上好！今天又和灯灯去水族馆看企鹅了哦～还拍了照片～",
								"motion": "smile04"
							},
							{
								"text": "晚上好！今天爽世世的妈妈应该也不会回来，要不要去陪陪她呢？",
								"motion": "smile04"
							}
						],
						[{
							"text": "晚上好。找到容身之处，很开心。",
							"motion": "smile01"
						}, {
							"text": "晚上好。猫咪很喜欢在SPACE门前集会。",
							"motion": "smile02"
						}],
						[
							{
								"text": "晚上好。小爱音那家伙，最终还是跟着我到家里了啊。",
								"motion": "sigh01"
							},
							{
								"text": "晚上好。小爱音又缠着我了，真是麻烦的孩子。",
								"motion": "sigh01"
							},
							{
								"text": "晚上好。小爱音今天直接回自己家了……可是，我没说不让她来……",
								"motion": "sad01"
							}
						],
						[{
							"text": "晚上好。今天也得加油把曲给编出来。",
							"motion": "serious01"
						}, {
							"text": "晚上好。这道题好难……不过真不想拜托爱音那家伙……",
							"motion": "thinking01"
						}]
					]
				},
				{
					"hour": "22-23",
					"text": [
						[{
							"text": "睡觉之前，要不要再在床上练习一下唱歌呢？",
							"motion": "smile01"
						}, {
							"text": "…………！写好了……！下首歌的歌词……！……咦？已经这么晚了……？",
							"motion": "surprised01"
						}],
						[{
							"text": "功课写完了，来弹一会儿吉他吧～",
							"motion": "smile02"
						}, {
							"text": "诶？喵梦亲这么晚了还开直播？我看看，我看看～",
							"motion": "smile03"
						}],
						[
							{
								"text": "睡觉了。晚安。",
								"motion": "smile04"
							},
							{
								"text": "外婆说，该睡觉了。",
								"motion": "serious01"
							},
							{
								"text": "该睡觉了。不过睡前再来一碗荞麦面吧。",
								"motion": "smile04"
							}
						],
						[{
							"text": "已经这么晚了吗？我是不熬夜主义者，还是赶紧睡觉吧。",
							"motion": "serious01"
						}, {
							"text": "晚上也要注意健康哦，看屏幕时要爱护眼睛。",
							"motion": "smile01"
						}],
						[{
							"text": "已经这个时间了吗……我还是再写一会儿曲子吧。",
							"motion": "serious01"
						}, {
							"text": "今天就不通宵了吧……早点睡觉，明天还要上学呢。",
							"motion": "sigh01"
						}]
					]
				},
				{
					"hour": "0-5",
					"text": [
						[{
							"text": "好黑啊……赶紧睡觉吧……",
							"motion": "sad01"
						}, {
							"text": "…………！写好了……！下首歌的歌词……！……咦？已经这么晚了……？",
							"motion": "surprised01"
						}],
						[{
							"text": "好困啊～这么晚还不睡觉，明天起的来吗？",
							"motion": "sigh01"
						}, {
							"text": "这么晚还不睡觉的话，明天会有黑眼圈哦……化妆盖不住的那种！",
							"motion": "serious01"
						}],
						[{
							"text": "毕竟，我是人，不是猫，晚上还是要睡觉的。",
							"motion": "serious01"
						}, {
							"text": "猫咪喜欢晚上出来，但是我不太能做到。",
							"motion": "sad01"
						}],
						[{
							"text": "又是一个安静的晚上，睡不着盯着小祥的头像。",
							"motion": "thinking01"
						}, {
							"text": "再不睡觉的话，就没法达成一辈子乐队的目标了啊……",
							"motion": "serious01"
						}],
						[{
							"text": "好像有点困。要不还是睡觉吧。",
							"motion": "sigh01"
						}, {
							"text": "好困……通宵果然吃不消……可是不这样做的话，新歌就来不及完成了……",
							"motion": "sad01"
						}]
					]
				}
			]
		};
		//#endregion
		//#region src/client/waifu/model.js
		const PIXI = { get Application() {
			return window.PIXI.Application;
		} };
		const Live2DModel = { get value() {
			return window.PIXI.live2d.Live2DModel;
		} };
		/**
		* 适合作为随机待机动作的 motion 组名。
		* 各角色的可用动作集不同，加载时会被过滤成该角色实际存在的集合。
		*/
		const IDLE_MOTIONS = [
			"smile01",
			"smile02",
			"smile03",
			"thinking01",
			"thinking02",
			"nf01",
			"nf02",
			"nnf01",
			"nnf02",
			"kandou01",
			"kime01",
			"sad01",
			"surprised01",
			"serious01",
			"shame01",
			"niya01",
			"ando01",
			"odoodo01",
			"sigh01"
		];
		var Model = class {
			constructor() {
				this.cdnPath = getConfig().cdnPath;
				this.app = new PIXI.Application({
					view: document.getElementById("live2d"),
					autoStart: true,
					width: 800,
					height: 800,
					backgroundAlpha: 0
				});
				this.modelList = modelList;
				this.tips = tips;
				this.model = null;
				this.modelIndex = null;
				this.modelMotions = [];
				this.modelExpressions = [];
				this.idleMotions = [];
			}
			async loadModel(modelId, modelTexturesId, message) {
				if (modelId >= this.modelList.length) modelId %= this.modelList.length;
				if (modelTexturesId >= this.modelList[modelId].length) modelTexturesId %= this.modelList[modelId].length;
				setModelId(modelId);
				setModelTexturesId(modelTexturesId);
				console.log(`Live2D Model ${modelId}-${modelTexturesId}`);
				showMessage(this, message, 4e3, 10);
				const target = this.modelList[modelId][modelTexturesId];
				const url = `${this.cdnPath}model/${target}/index.json`;
				try {
					this.modelIndex = await fetch(url).then((response) => {
						if (!response.ok) throw new Error(`HTTP ${response.status}`);
						return response.json();
					});
				} catch (error) {
					console.error(`模型加载失败: ${url}`, error);
					showMessage(this, {
						text: "呜……模型加载失败了，换个衣服试试？",
						motion: "sad01"
					}, 5e3, 10);
					return;
				}
				this.modelIndex.url = url;
				if (!this.modelIndex.motions.idle && this.modelIndex.motions.idle01) this.modelIndex.motions.idle = this.modelIndex.motions.idle01;
				if (Array.isArray(this.modelIndex.expressions) && !this.modelIndex.expressions.find((expression) => expression.name === "idle") && this.modelIndex.expressions.find((expression) => expression.name === "idle01")) this.modelIndex.expressions.push({
					name: "idle",
					file: this.modelIndex.expressions.find((expression) => expression.name === "idle01").file
				});
				this.modelMotions = Object.keys(this.modelIndex.motions || {});
				this.modelExpressions = (this.modelIndex.expressions || []).map((expression) => expression.name);
				this.idleMotions = IDLE_MOTIONS.filter((motion) => this.modelMotions.includes(motion));
				this.app.stage.removeChildren();
				try {
					this.model = await Live2DModel.value.from(this.modelIndex, { motionPreload: getConfig().preload });
				} catch (error) {
					console.error("Live2D 模型渲染初始化失败", error);
					showMessage(this, {
						text: "呜……渲染器罢工了，刷新一下试试？",
						motion: "sad01"
					}, 5e3, 10);
					return;
				}
				this.app.stage.addChild(this.model);
				this.model.scale.set(.33);
				updateMessageArray(this.tips);
			}
			/** 播放一个随机的待机动作（不弹气泡） */
			playRandomIdle() {
				if (!this.model || !this.idleMotions.length) return;
				const motion = this.idleMotions[Math.floor(Math.random() * this.idleMotions.length)];
				try {
					this.model.motion(motion);
				} catch (error) {}
			}
			/** 随机切换一个表情 */
			playRandomExpression() {
				if (!this.model || !this.modelExpressions.length) return;
				const expression = this.modelExpressions[Math.floor(Math.random() * this.modelExpressions.length)];
				try {
					this.model.expression(expression);
				} catch (error) {}
			}
			/** 让模型视线跟随屏幕坐标（canvas 空间，可超出 0~800） */
			focusAt(clientX, clientY) {
				if (!this.model) return;
				const canvas = this.app.view;
				const rect = canvas.getBoundingClientRect();
				if (rect.width === 0 || rect.height === 0) return;
				const x = (clientX - rect.left) * (canvas.width / rect.width);
				const y = (clientY - rect.top) * (canvas.height / rect.height);
				try {
					this.model.focus(x, y);
				} catch (error) {}
			}
			/** 截取当前画面为 PNG dataURL */
			capture() {
				if (!this.model) return null;
				try {
					return this.app.renderer.plugins.extract.canvas(this.app.stage).toDataURL("image/png");
				} catch (error) {
					try {
						return this.app.view.toDataURL("image/png");
					} catch (error2) {
						return null;
					}
				}
			}
		};
		//#endregion
		//#region src/client/waifu/tools.js
		const fa_circle_user = "data:image/svg+xml," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z\"/></svg>");
		const fa_camera_retro = "data:image/svg+xml," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM344 304c0 48.6-39.4 88-88 88s-88-39.4-88-88s39.4-88 88-88s88 39.4 88 88z\"/></svg>");
		const fa_circle_info = "data:image/svg+xml," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z\"/></svg>");
		const fa_xmark = "data:image/svg+xml," + encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><path d=\"M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z\"/></svg>");
		const tools = {
			"switch-model": {
				icon: fa_circle_user,
				callback: () => {}
			},
			"photo": {
				icon: fa_camera_retro,
				callback: () => {}
			},
			"info": {
				icon: fa_circle_info,
				callback: () => {
					showMessage({
						expression: () => null,
						motion: () => null
					}, {
						text: "MyGO!!!!! Live2D 桌宠插件 · 5 角色 × 74 套换装",
						motion: "smile01"
					}, 4e3, 10);
				}
			},
			"quit": {
				icon: fa_xmark,
				callback: () => {
					localStorage.setItem("waifu-display", Date.now());
					const waifu = document.getElementById("waifu");
					if (waifu) waifu.style.bottom = "-500px";
					setTimeout(() => {
						const toggle = document.getElementById("waifu-toggle");
						if (toggle) toggle.classList.add("waifu-toggle-active");
					}, 3e3);
				}
			}
		};
		//#endregion
		//#region src/client/waifu/characters.js
		/**
		* 角色元数据与模型资源名工具。
		*
		* 模型目录统一为 `<角色>/<资源id>_<中文标签>`（如 `tomori/036_casual-2023_常服`），
		* 其中「中文标签」用于在换装面板中展示，实际资源（缩略图 / 贴图）仍使用不带标签的
		* `<资源id>` 命名（如 `assets/036_live_default.png`）。本文件提供两组转换函数。
		*/
		const CHARACTERS = [
			{
				id: "tomori",
				num: 36,
				name: "高松 燈",
				en: "Tomori",
				color: "#8ec9e8"
			},
			{
				id: "anon",
				num: 37,
				name: "千早 愛音",
				en: "Anon",
				color: "#f2a7b8"
			},
			{
				id: "rana",
				num: 38,
				name: "要 楽奈",
				en: "Rāna",
				color: "#f4c95d"
			},
			{
				id: "soyo",
				num: 39,
				name: "長崎 そよ",
				en: "Soyo",
				color: "#b9a7d9"
			},
			{
				id: "taki",
				num: 40,
				name: "椎名 立希",
				en: "Taki",
				color: "#7fa9d9"
			}
		];
		/**
		* 从模型目录名中提取「中文标签」。
		* `tomori/036_casual-2023_常服` -> `常服`
		* `anon/037_live_event_240_sr_活动240` -> `活动240`
		*/
		function textureLabel(dir) {
			const match = dir.match(/_([\p{Script=Han}][\p{Script=Han}0-9A-Za-z]*)$/u);
			return match ? match[1] : dir.split("/").pop();
		}
		/**
		* 去掉目录名末尾的中文标签，得到原始资源 id。
		* `036_live_default_默认` -> `036_live_default`
		* 注意：标签组必须「以下划线 + 汉字开头」，否则会把 `live_default` 这种带下划线的
		* 基础 id 也误剥掉（`_live_default_默认` 整段被匹配）。
		*/
		function stripTextureLabel(dir) {
			return dir.replace(/_\p{Script=Han}[\p{Script=Han}0-9A-Za-z]*$/u, "");
		}
		/**
		* 由模型目录名得到平铺在 `assets/` 下的资源文件名（去掉中文标签）。
		* `036_live_default_默认` -> `036_live_default`
		*/
		function textureAssetId(dir) {
			return stripTextureLabel(dir);
		}
		/**
		* 该换装是否有缩略图资源（live / 活动 / 生日 / 梦祭 / 联动等「卡片」换装有 assets 图，
		* 常服 / 校服 / 和服 / 打工等没有，面板中将以文字标签展示）。
		*/
		function hasTextureAsset(dir) {
			const base = stripTextureLabel(dir);
			return !/[_](casual|school|furisode|arbeit|story)/.test(base);
		}
		//#endregion
		//#region src/client/waifu/index.js
		const TOOL_TITLES = {
			"switch-model": "切换角色",
			"photo": "拍照",
			"info": "关于",
			"quit": "隐藏"
		};
		/** 轻量监听/定时器收集器：插件卸载时统一清理 */
		function createHooks() {
			const listeners = [];
			const intervals = [];
			return {
				on(target, event, fn) {
					target.addEventListener(event, fn);
					listeners.push([
						target,
						event,
						fn
					]);
				},
				interval(fn, ms) {
					intervals.push(setInterval(fn, ms));
				},
				stop() {
					for (const [target, event, fn] of listeners) try {
						target.removeEventListener(event, fn);
					} catch {}
					for (const id of intervals) clearInterval(id);
					listeners.length = 0;
					intervals.length = 0;
				}
			};
		}
		async function loadWidget(hooks) {
			document.body.insertAdjacentHTML("beforeend", `
    <div id="waifu">
      <canvas id="live2d" width="800" height="800"></canvas>
      <div id="waifu-tips"></div>
      <div id="waifu-tool"></div>
    </div>
    <div id="model-selection-panel" class="waifu-panel" style="display: none;"></div>
    <div id="texture-selection-panel" class="waifu-panel" style="display: none;"></div>`);
			const model = new Model();
			localStorage.removeItem("waifu-display");
			sessionStorage.removeItem("waifu-text");
			const waifu = document.getElementById("waifu");
			const toolBar = document.getElementById("waifu-tool");
			const modelPanel = document.getElementById("model-selection-panel");
			const texturePanel = document.getElementById("texture-selection-panel");
			let selectedModelIndex = null;
			const drag = enableDrag(waifu);
			restorePosition(waifu);
			const waifuRect = () => waifu.getBoundingClientRect();
			function openPanel(panel) {
				panel.style.display = "block";
				const pw = panel.offsetWidth, ph = panel.offsetHeight;
				const rect = waifuRect();
				let left = rect.right + 8;
				if (left + pw > window.innerWidth - 8) left = rect.left - pw - 8;
				left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
				const top = Math.max(8, Math.min(rect.top, window.innerHeight - ph - 8));
				panel.style.position = "fixed";
				panel.style.left = left + "px";
				panel.style.top = top + "px";
				panel.style.right = "auto";
				panel.style.bottom = "auto";
			}
			function closePanels() {
				modelPanel.style.display = "none";
				texturePanel.style.display = "none";
			}
			tools["switch-model"].callback = () => {
				if (modelPanel.style.display !== "none") {
					closePanels();
					return;
				}
				renderModelPanel();
				openPanel(modelPanel);
			};
			tools["photo"].callback = () => {
				const url = model.capture();
				if (!url) {
					showMessage(model, {
						text: "呜……拍照失败了，再试一次吧？",
						motion: "sad01"
					}, 4e3, 10);
					return;
				}
				const a = document.createElement("a");
				a.href = url;
				a.download = `live2d-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				showMessage(model, {
					text: "拍好啦！这张照片，要好好珍藏哦！",
					motion: "smile01"
				}, 4e3, 10);
			};
			if (!Array.isArray(getConfig().tools)) getConfig().tools = Object.keys(tools);
			for (const tool of getConfig().tools) {
				if (!tools[tool]) continue;
				const { icon, callback } = tools[tool];
				toolBar.insertAdjacentHTML("beforeend", `<span id="waifu-tool-${tool}" title="${TOOL_TITLES[tool] || tool}">${decodeURIComponent(icon).replace("data:image/svg+xml,", "")}</span>`);
				document.getElementById(`waifu-tool-${tool}`).addEventListener("click", callback);
			}
			function renderModelPanel() {
				let html = "";
				modelList.forEach((textures, index) => {
					const char = CHARACTERS[index];
					const defaultTexture = textures.find((texture) => texture.includes("_live_default"));
					const asset = defaultTexture ? `${getConfig().cdnPath}assets/${textureAssetId(defaultTexture)}.png` : `${getConfig().cdnPath}assets/chara_icon_${char.num}.png`;
					html += `
            <button class="model-option" data-model-index="${index}" style="--accent:${char.color}">
              <img src="${asset}" alt="${char.name}" loading="lazy">
              <span class="model-option-text">
                <span class="model-option-name">${char.name}</span>
                <span class="model-option-en">${char.en}</span>
              </span>
            </button>`;
				});
				modelPanel.innerHTML = `
            <div class="waifu-panel-header"><span>选择角色</span><button class="waifu-panel-close" aria-label="关闭">✕</button></div>
            <div class="waifu-panel-body">${html}</div>`;
			}
			function renderTexturePanel(charIndex) {
				const char = CHARACTERS[charIndex];
				const textures = modelList[charIndex];
				let html = "";
				textures.forEach((dir, index) => {
					const label = textureLabel(dir);
					const base = textureAssetId(dir);
					const asset = `${getConfig().cdnPath}assets/${base}.png`;
					if (hasTextureAsset(dir)) html += `
                <button class="texture-option" data-texture-index="${index}">
                  <img src="${asset}" alt="${label}" loading="lazy">
                  <span>${label}</span>
                </button>`;
					else html += `
                <button class="texture-option texture-option-text" data-texture-index="${index}">
                  <span>${label}</span>
                </button>`;
				});
				texturePanel.innerHTML = `
            <div class="waifu-panel-header">
              <button class="waifu-panel-back" aria-label="返回">←</button>
              <span>${char.name} · 换装</span>
              <button class="waifu-panel-close" aria-label="关闭">✕</button>
            </div>
            <div class="waifu-panel-body">${html}</div>`;
			}
			hooks.on(modelPanel, "click", async (event) => {
				if (event.target.closest(".waifu-panel-close")) {
					closePanels();
					return;
				}
				const button = event.target.closest(".model-option");
				if (!button) return;
				selectedModelIndex = parseInt(button.getAttribute("data-model-index"), 10);
				renderTexturePanel(selectedModelIndex);
				modelPanel.style.display = "none";
				openPanel(texturePanel);
			});
			hooks.on(texturePanel, "click", async (event) => {
				if (event.target.closest(".waifu-panel-close")) {
					closePanels();
					return;
				}
				if (event.target.closest(".waifu-panel-back")) {
					texturePanel.style.display = "none";
					openPanel(modelPanel);
					return;
				}
				const button = event.target.closest(".texture-option");
				if (!button) return;
				const textureIndex = parseInt(button.getAttribute("data-texture-index"), 10);
				closePanels();
				await model.loadModel(selectedModelIndex, textureIndex);
			});
			hooks.on(document, "click", (event) => {
				if (event.target.closest("#model-selection-panel") || event.target.closest("#texture-selection-panel") || event.target.closest("#waifu-tool") || event.target.closest("#waifu-toggle")) return;
				closePanels();
			});
			hooks.on(document, "keydown", (event) => {
				if (event.key === "Escape") closePanels();
			});
			registerEventListener(model, drag, hooks);
			const api = {
				loadModel: (charId, texId) => model.loadModel(charId, texId),
				getModelList: () => modelList,
				getState: () => ({
					modelId: getModelId(),
					modelTexturesId: getModelTexturesId()
				}),
				capture: () => model.capture(),
				playRandomIdle: () => model.playRandomIdle(),
				showMessage,
				debug: () => ({
					stageChildren: model.app.stage.children.length,
					modelLoaded: !!model.model,
					modelSize: model.model ? {
						w: Math.round(model.model.width),
						h: Math.round(model.model.height)
					} : null,
					appRunning: !!(model.app.ticker && model.app.ticker.started),
					canvas: model.app.view ? {
						id: model.app.view.id,
						w: model.app.view.width,
						h: model.app.view.height
					} : null,
					pixiVersion: window.PIXI && window.PIXI.VERSION
				})
			};
			window.L2D = api;
			if (getModelId() === null) resetModelState();
			await model.loadModel(getModelId(), getModelTexturesId());
			return () => {
				hooks.stop();
				clearMessageTimer();
				try {
					model.app.destroy(true);
				} catch {}
				for (const el of [
					waifu,
					modelPanel,
					texturePanel
				]) try {
					if (el && el.parentNode) el.parentNode.removeChild(el);
				} catch {}
				if (window.L2D === api) window.L2D = void 0;
			};
		}
		function enableDrag(widgetEl) {
			const drag = {
				active: false,
				moved: false,
				startX: 0,
				startY: 0,
				originX: 0,
				originY: 0
			};
			widgetEl.addEventListener("pointerdown", (event) => {
				if (event.target.closest("#waifu-tool") || event.target.closest(".waifu-panel") || event.target.closest("#waifu-toggle")) return;
				drag.active = true;
				drag.moved = false;
				drag.startX = event.clientX;
				drag.startY = event.clientY;
				const rect = widgetEl.getBoundingClientRect();
				drag.originX = rect.left;
				drag.originY = rect.top;
				widgetEl.classList.add("waifu-dragging");
				try {
					widgetEl.setPointerCapture(event.pointerId);
				} catch (error) {}
			});
			widgetEl.addEventListener("pointermove", (event) => {
				if (!drag.active) return;
				const dx = event.clientX - drag.startX;
				const dy = event.clientY - drag.startY;
				if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
				if (!drag.moved) return;
				const left = Math.min(Math.max(drag.originX + dx, -120), window.innerWidth - 40);
				const top = Math.min(Math.max(drag.originY + dy, -80), window.innerHeight - 40);
				widgetEl.style.left = left + "px";
				widgetEl.style.top = top + "px";
				widgetEl.style.right = "auto";
				widgetEl.style.bottom = "auto";
			});
			const endDrag = (event) => {
				if (!drag.active) return;
				drag.active = false;
				widgetEl.classList.remove("waifu-dragging");
				if (drag.moved) {
					const rect = widgetEl.getBoundingClientRect();
					try {
						localStorage.setItem("waifu-pos", JSON.stringify({
							left: rect.left,
							top: rect.top
						}));
					} catch (error) {}
				}
			};
			widgetEl.addEventListener("pointerup", endDrag);
			widgetEl.addEventListener("pointercancel", endDrag);
			return drag;
		}
		function restorePosition(widgetEl) {
			try {
				const pos = JSON.parse(localStorage.getItem("waifu-pos"));
				if (!pos || typeof pos.left !== "number" || typeof pos.top !== "number") return;
				const left = Math.min(Math.max(pos.left, -120), window.innerWidth - 40);
				const top = Math.min(Math.max(pos.top, -80), window.innerHeight - 40);
				widgetEl.style.left = left + "px";
				widgetEl.style.top = top + "px";
				widgetEl.style.right = "auto";
				widgetEl.style.bottom = "auto";
			} catch (error) {}
		}
		function registerEventListener(model, drag, hooks) {
			let userAction = false;
			let idleSeconds = 0;
			let lastHoverElement;
			let lastFocusTime = 0;
			hooks.on(window, "mousemove", (event) => {
				userAction = true;
				const now = Date.now();
				if (now - lastFocusTime > 50) {
					lastFocusTime = now;
					model.focusAt(event.clientX, event.clientY);
				}
			});
			hooks.on(window, "mousedown", () => userAction = true);
			hooks.on(window, "keydown", () => userAction = true);
			hooks.on(window, "scroll", () => userAction = true, true);
			hooks.interval(() => {
				if (userAction) {
					userAction = false;
					idleSeconds = 0;
					return;
				}
				idleSeconds++;
				if (idleSeconds === 18) showMessage(model, getMessageArray(), 6e3, 9);
				else if (idleSeconds > 18 && idleSeconds % 30 === 0) model.playRandomIdle();
			}, 1e3);
			hooks.on(window, "mouseover", (event) => {
				if (event.target.closest("#live2d")) {
					showMessage(model, getMessageArray(), 4e3, 9);
					return;
				}
				for (const { selector, text } of tips.mouseover) {
					if (!event.target.closest(selector)) continue;
					if (lastHoverElement === selector) return;
					lastHoverElement = selector;
					showMessage(model, randomSelection(text[getModelId()]), 4e3, 10);
					return;
				}
			});
			hooks.on(window, "click", (event) => {
				if (drag.moved) return;
				if (event.target.closest("#live2d")) {
					showMessage(model, getMessageArray(), 4e3, 9);
					return;
				}
				for (const { selector, text } of tips.mouseover) {
					if (!event.target.closest(selector)) continue;
					showMessage(model, randomSelection(text[getModelId()]), 4e3, 10);
					return;
				}
			});
			hooks.on(window, "resize", () => {
				const threshold = 160;
				const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
				const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
				if (widthDiff > threshold || heightDiff > threshold) showMessage(model, tips.message.console[getModelId()], 6e3, 9);
			});
			hooks.on(window, "copy", () => {
				showMessage(model, tips.message.copy[getModelId()], 6e3, 9);
			});
			hooks.on(document, "visibilitychange", () => {
				if (!document.hidden) showMessage(model, tips.message.visibilitychange[getModelId()], 6e3, 9);
			});
		}
		/**
		* 启动桌宠。返回停止函数（插件卸载时调用）：清理监听/定时器、销毁渲染器、移除 DOM。
		*/
		async function initWidget(config) {
			const hooks = createHooks();
			setConfig(config);
			document.getElementById("waifu-toggle")?.remove();
			document.getElementById("waifu")?.remove();
			document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle"><span>Live2D</span></div>`);
			const toggle = document.getElementById("waifu-toggle");
			let stopWidget = () => {};
			const toggleStop = () => {
				hooks.stop();
				try {
					if (toggle && toggle.parentNode) toggle.parentNode.removeChild(toggle);
				} catch {}
				stopWidget();
			};
			hooks.on(toggle, "click", async () => {
				toggle.classList.remove("waifu-toggle-active");
				if (toggle.getAttribute("first-time")) {
					stopWidget = await loadWidget(hooks);
					toggle.removeAttribute("first-time");
				} else {
					localStorage.removeItem("waifu-display");
					const waifuEl = document.getElementById("waifu");
					if (waifuEl) {
						waifuEl.style.display = "";
						setTimeout(() => {
							waifuEl.style.bottom = "20px";
						}, 0);
					}
				}
			});
			if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 864e5) {
				toggle.setAttribute("first-time", true);
				setTimeout(() => {
					toggle.classList.add("waifu-toggle-active");
				}, 0);
			} else stopWidget = await loadWidget(hooks);
			return toggleStop;
		}
		//#endregion
		//#region src/client/index.ts
		/** vendor 运行时脚本（host 同源路由，按依赖顺序加载）。
		*  Cubism 2.1 渲染链：live2d.min.js（框架，暴露 window.Live2D / Live2DModelWebGL）
		*  → pixi.min.js（PIXI 6）→ live2d-display.cubism2.min.js（pixi-live2d-display
		*  0.4.0 的 cubism2 版，运行时校验 window.Live2D 存在）。
		*  Cubism 2.1 不需要 live2dcubismcore.min.js（那是 Cubism 4 链的依赖）。
		*/
		const VENDOR_SCRIPTS = [
			"/pet-assets/vendor/live2d.min.js",
			"/pet-assets/vendor/pixi.min.js",
			"/pet-assets/vendor/live2d-display.cubism2.min.js"
		];
		/** 桌宠容器与面板的 z-index 覆盖（dsh GUI 上方悬浮）+ 默认放右下（避开左侧栏）。 */
		const Z_INDEX_OVERRIDE = `
#waifu, #waifu-toggle { z-index: 2147483646 !important; }
.waifu-panel { z-index: 2147483647 !important; }
#waifu { left: auto; right: 20px; top: 20px; bottom: auto; }
`;
		function loadScript(src) {
			return new Promise((resolve, reject) => {
				const tag = document.createElement("script");
				tag.src = src;
				tag.onload = () => resolve();
				tag.onerror = () => reject(/* @__PURE__ */ new Error(`加载 ${src} 失败`));
				document.head.appendChild(tag);
			});
		}
		/** 插件入口：注入 CSS + 按序加载运行时 + 启动桌宠；清理注册为 ctx.effect disposer。 */
		function apply(ctx) {
			ctx.effect(() => {
				const cleanup = [];
				let disposed = false;
				const stop = () => {
					if (disposed) return;
					disposed = true;
					for (const fn of cleanup) try {
						fn();
					} catch {}
					cleanup.length = 0;
				};
				fetch("/pet-assets/waifu.css").then((res) => res.ok ? res.text() : Promise.reject(/* @__PURE__ */ new Error(`HTTP ${res.status}`))).then((css) => {
					if (disposed) return;
					const style = document.createElement("style");
					style.id = "live2d-mygo-css";
					style.textContent = css + Z_INDEX_OVERRIDE;
					document.head.appendChild(style);
					cleanup.push(() => style.remove());
				}).catch((error) => console.error("[live2d-mygo] 样式加载失败", error));
				(async () => {
					for (const src of VENDOR_SCRIPTS) {
						await loadScript(src);
						if (disposed) return;
					}
					if (disposed) return;
					try {
						await initWidget({
							cdnPath: "/pet-assets/",
							preload: "IDLE",
							tools: [
								"switch-model",
								"photo",
								"info",
								"quit"
							]
						});
					} catch (error) {
						console.error("[live2d-mygo] 桌宠启动失败", error);
					}
				})();
				return stop;
			}, "live2d-mygo: widget");
		}
		//#endregion
		exports.apply = apply;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map