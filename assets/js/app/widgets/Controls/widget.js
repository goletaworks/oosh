define(function(){
    return {
        "id" : "Controls",
        "name" : "Controls",
        "description" : "Slider widgets you can configure to control other widgets.",
        "template" : "main",
        "triggers" :  [
            {
                "name":"slider",
                "event":{
                    "name": "oosh.midimessage",
                    "properties":{
                        "detail:properties:data[0]" : "144",
                        "detail:properties:data[1]" : { "lessThan" : 72 },
                        "detail:properties:data[2]" : { "not" : "0" }
                    }
                },
                "targets": [{
                    "type": { "widget": "Controls" },
                    "action":"onKeyDown",
                    "parameters": {
                        "midiNote" : { "input" : "event:detail:properties:data[1]" },
                        "screenId": { "input" : "screenId" },
                        "areaId": { "input" : "area:id" }
                    }
                }]
            },

            {
                "name":"oosh.midimessage => webaudio.oscillator.stop1",
                "event":{
                    "name": "oosh.midimessage",
                    "properties":{
                        "detail:properties:data[0]" : "128",
                        "detail:properties:data[1]" : { "lessThan" : 72 }
                    }
                },
                "targets": [{
                    "type": "WebAudioOscillator",
                    "action":"stop",
                    "parameters": {
                        "id": {
                            "input" : "event:detail:properties:data[1]"
                        }
                    }
                },
                {
                    "type": "WebAudioOscillator",
                    "action":"stop",
                    "parameters": {
                        "id": {
                            "input" : "event:detail:properties:data[1]",
                            "transform": [
                                {"prefix":"osc2"}
                            ]
                        }
                    }
                },
                {
                    "type": { "widget": "Controls" },
                    "action":"onKeyUp",
                    "parameters": {
                        "midiNote" : { "input" : "event:detail:properties:data[1]" },
                        "screenId": { "input" : "screenId" },
                        "areaId": { "input" : "area:id" }
                    }
                }]
            },

            {
                "name":"oosh.midimessage => webaudio.oscillator.stop2",
                "event":{
                    "name": "oosh.midimessage",
                    "properties":{
                        "detail:properties:data[0]" : "144",
                        "detail:properties:data[1]" : { "lessThan" : 72 },
                        "detail:properties:data[2]" : "0"
                    }
                },
                "targets": [{
                    "type": "WebAudioOscillator",
                    "action":"stop",
                    "parameters": {
                        "id": {
                            "input" : "event:detail:properties:data[1]"
                        }
                    }
                },
                {
                    "type": { "widget": "Controls" },
                    "action":"onKeyUp",
                    "parameters": {
                        "midiNote" : { "input" : "event:detail:properties:data[1]" },
                        "screenId": { "input" : "screenId" },
                        "areaId": { "input" : "area:id" }
                    }
                }]
            }
        ],

        onKeyDown : function(params){
            var kbd = jQuery('#' + params.areaId + ' .keyboard');
            var key = kbd.find('.Key' + (params.midiNote+1) + ' > div');
            key.addClass('keydown');
            //kbd.scrollLeft(key.parent().position().left - 10);
        },

        onKeyUp : function(params){
            var kbd = jQuery('#' + params.areaId + ' .keyboard');
            var key = kbd.find('.Key' + (params.midiNote+1) + ' > div');
            key.removeClass('keydown');

        },

        initializeWidget : function(params){
            var blacks = [1, 3, 6, 8, 10], afterBlacks = [2, 4, 7, 9, 11];
            var lastLeft = 0;
            var pos = 0;
            var kbd = jQuery('#' + params.areaId + ' .Controls .keyboard');
            for(var i=0; i<127; i++){
                var isBlackKey = blacks.find(function(test){
                    return pos == test;
                });
                var isAfterBlackKey = afterBlacks.find(function(test){
                    return pos == test;
                });
                var keyClass = isBlackKey? 'black-key':'white-key';
                var key = jQuery('<div class="key Key' + (i+1) + '">' +
                        '<div class="' + keyClass + '">' +
                        (pos === 0 ? i / 12 : '') +
                        '</div></div>');
                kbd.append(key);

                lastLeft += isBlackKey || isAfterBlackKey ? 10 : 20;
                key.css({ left : lastLeft + 'px'});

                if(pos==11){
                    pos = 0;
                }
                else{
                    pos++;
                }
            }
        }
    };
});
