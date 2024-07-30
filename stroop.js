let jsPsych = initJsPsych({
    override_safe_mode: true
   });

let open_fullscreen = {   
    type: jsPsychFullscreen,   
    fullscreen_mode: true,
    button_label: '进入全屏',
    delay_after: 1000,
    //指导语呈现完毕，鼠标消失
    on_finish: function () {
        var bodyNode = document.getElementsByTagName("body");
        for (let i = 0; i < bodyNode.length; i++) {
            bodyNode[i].style.cursor = "none";
        }
    },
    show_clickable_nav: true
};

let pre_instruction = {
type: jsPsychHtmlKeyboardResponse,
   stimulus: `
<div>
<p> 现在是一个练习实验</p>
<p>在实验中，屏幕中央会呈现一个词语，该词语表示一种颜色。</p>
<p>你的任务是忽略词语的含义，尽快按键报告词语的字体颜色。</p>
<p>如果词语的字体颜色是<span style="color: red;">红色</span>，请按 A 键</p>
<p>如果词语的字体颜色是<span style="color: green;">绿色</span>，请按 D 键</p>
<p>如果词语的字体颜色是<span style="color: yellow;">黄色</span>，请按 J 键</p>
<p>如果词语的字体颜色是<span style="color: blue;">蓝色</span>，请按 L 键</p>
<p>按空格键开始实验</p>
</div>
`,
choices: " ",
   post_trial_gap: 500
};
//
let timeline =[open_fullscreen,pre_instruction];

let fixation = {
type: jsPsychHtmlKeyboardResponse,
stimulus: '<p style="font-size: 36px;">+</p>',
choices: "NO_KEYS",
trial_duration: 500
};

let practice_stimuli = [
{ stimulus: '<p style="color: red;">红</p>', correct_response: 'a' },
{ stimulus: '<p style="color: green;">红</p>', correct_response: 'd' },
{ stimulus: '<p style="color: red;">绿</p>', correct_response: 'a' },
{ stimulus: '<p style="color: green;">绿</p>', correct_response: 'd' },
{ stimulus: '<p style="color: yellow;">黄</p>', correct_response: 'j' },
{ stimulus: '<p style="color: yellow;">蓝</p>', correct_response: 'j' },
{ stimulus: '<p style="color: blue;">黄</p>', correct_response: 'l' },
{ stimulus: '<p style="color: blue;">蓝</p>', correct_response: 'l' }
];

let practice_trial = {
type: jsPsychHtmlKeyboardResponse,
stimulus: function() {
let stimulus = jsPsych.timelineVariable('stimulus');
// 使用一个带有样式的 div 包裹刺激，设置字号为 45px
return `<div style="font-size: 45px;">${stimulus}</div>`;
},
choices: ['a','d','j', 'l'],
trial_duration: 1500,
data: {
correct_response: jsPsych.timelineVariable('correct_response')
},
on_finish: function(data) {
data.correct = data.response == data.correct_response;
}
};

let practice_procedure = {
timeline: [
    fixation,
    practice_trial
],
timeline_variables: practice_stimuli,
  sample: {
type: 'fixed-repetitions',
size: 10
},
randomize_order: true
};
timeline.push(practice_procedure);

        //退出全屏模式
let quitFullscreenMode = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    //全部结束，鼠标出现
    on_finish: function () {
        var bodyNode = document.getElementsByTagName("body");
        for (let i = 0; i < bodyNode.length; i++) {
            bodyNode[i].style.cursor = "default";
        }
    }
};
timeline.push(quitFullscreenMode);
let end_message_trial = {
type: jsPsychHtmlKeyboardResponse,
stimulus: '感谢您的参与，请您关闭网页即可。',
choices:"NO_KEYS",
trial_duration: 5000  // 显示结束语的时间，单位为毫秒
};
timeline.push(end_message_trial);
jsPsych.run(timeline);