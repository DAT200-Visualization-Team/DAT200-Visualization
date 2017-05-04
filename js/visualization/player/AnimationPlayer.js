var AnimationPlayer = (function () {
    var instance;
    var isPlaying = false;

    return {
        setPlayState: function (value) {
            isPlaying = true;
        },
        getPlayState: function () {
            return isPlaying;
        },
        togglePlayState: function () {
            isPlaying = !isPlaying;
        }
    };
})();

function StepSequence(steps) {

}

function togglePlayState(element) {
    AnimationPlayer.togglePlayState();
    if (AnimationPlayer.getPlayState())
        element.innerHTML = 'pause';
    else
        element.innerHTML = 'play_arrow';
}

$('#play-button').click(function () {
    togglePlayState(this);
});

$('#step-back').click(function () {
    
});

$('#step-forward').click(function () {
    
});