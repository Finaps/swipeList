/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, document, jQuery */
/*mendix */
/*
    SwipeList
    ========================

    @file      : SwipeList.js
    @version   : 
    @author    : Simon Martyr
    @date      : Wed, 22 Apr 2015 15:11:20 GMT
    @copyright : 
    @license   : 

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text', 'dojo/html', 'dojo/_base/event',
    'SwipeList/lib/jquery-1.11.2.min', 'dojo/text!SwipeList/widget/template/SwipeList.html', 'dojo/text!SwipeList/widget/template/SwipeListItem.html', 'dojo/text!SwipeList/widget/template/base.html', 'SwipeList/lib/swipe'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, html, event, _jQuery, widgetTemplate, totalList, base, swipe) {
    'use strict';

    var $ = jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare('SwipeList.widget.SwipeList', [_WidgetBase, _TemplatedMixin], {

        templateString: base,
        // Parameters configured in the Modeler.
        main: "",
        attrs: "",
        mfGetData: "",
        //button params
        buttonCount: "",
        mfBtnOne: "",
        mfBtnTwo: "",
        buttonOneName: "",
        buttonTwoName: "",
        general: "",
        side: "",
        maxTrigger: "",
        includeLabels: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _objProperty: null,


        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');

            window.mfBtnOne = this.mfBtnOne;
            window.mfBtnTwo = this.mfBtnTwo;
            window.butCount = this.buttonCount;
            window.direction = this.side.toLowerCase();
            window.mfClick = this.general;
            window.powerSlide = this.maxTrigger;

            this._loadList();
        },



        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            if (typeof document.ontouchstart !== 'undefined') {
                event.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
            console.log("hit event settup");
            //settup button events + swipe events. 

            if (!this.buttonCount) {
                $(".buttonTwo").remove();
            }


            $(".swipe").find("button").css("float", window.direction);



            //swipper settup
            $(".swipeItem").swipe({
                triggerOnTouchEnd: true,
                swipeStatus: function (event, phase, direction, distance) {

                    var width = $(this).width(),
                        widthBt = $(this).parent().find(".buttonTwo").outerWidth();


                    if (phase == "move" && (direction == "left" || direction == "right")) {
                        var duration = 0,
                            value = 0;


                        if (direction == "right") {
                            $(this).css("left", distance + "px");


                        } else if (direction == "left") {
                            $(this).css("left", -distance + "px");
                        }

                        if (distance > (window.butCount ? widthBt * 2 : widthBt) && direction != window.direction && window.powerSlide) 
                        {
                            $(this).parent().find(".buttonOne").css("width", distance + "px");
                            $(this).parent().find(".buttonOne").css("text-align", window.direction);
                        } else {
                            $(this).parent().find(".buttonOne").css("width", "");
                            $(this).parent().find(".buttonOne").css("text-align", "");
                        }


                    } else if (phase == "cancel") {
                        if (distance == 0) {

                            mx.data.action({
                                params: {
                                    applyto: 'selection',
                                    actionname: window.mfClick,
                                    guids: [$(this).attr('guid')]
                                },
                                /*callback: function (obj) {
                                    //TODO what to do when all is ok!
                                    },*/
                                error: function (error) {
                                    console.log(this.id + ': An error occurred while executing microflow: ' + error.description);
                                }
                            }, this);
                            return;

                        }
                    } else if (phase == "end") {
                        //tap event


                        //max strech
                        if (distance > (width * 0.65) && direction != window.direction && window.powerSlide) {
                            mx.data.action({
                                params: {
                                    applyto: 'selection',
                                    actionname: window.mfBtnOne,
                                    guids: [$(this).attr('guid')]
                                },
                                /*callback: function (obj) {
                                    //TODO what to do when all is ok!
                                    },*/
                                error: function (error) {
                                    console.log(this.id + ': An error occurred while executing microflow: ' + error.description);
                                }
                            }, this);
                            $(this).css("left", "");
                            $(this).parent().find(".buttonOne").css("width", "");
                            $(this).parent().find(".buttonOne").css("text-align", "");
                            return;
                        }

                        //reset streching. 
                        $(this).parent().find(".buttonOne").css("width", "");
                        $(this).parent().find(".buttonOne").css("text-align", "");

                        //normal swipe. 
                        if (direction == "right") {
                            if (window.butCount) {
                                if (window.direction == "left") {
                                    $(this).css("left", (widthBt * 2) + "px");
                                } else {
                                    $(this).css("left", "");
                                }
                            } else {
                                if (window.direction == "left") {
                                    $(this).css("left", widthBt + "px");
                                } else {
                                    $(this).css("left", "");
                                }
                            }
                        } else if (direction == "left") {
                            if (window.butCount) {
                                if (window.direction != "left") {
                                    $(this).css("left", "-" + (widthBt * 2) + "px");
                                } else {
                                    $(this).css("left", "");
                                }
                            } else {
                                if (window.direction != "left") {
                                    $(this).css("left", "-" + widthBt + "px");
                                } else {
                                    $(this).css("left", "");
                                }
                            }
                        }
                    }


                },
                allowPageScroll: "vertical",
                threshold: 10
            });


            $(this.domNode).on('click', '.buttonOne', function () {
                mx.data.action({
                    params: {
                        applyto: 'selection',
                        actionname: window.mfBtnOne,
                        guids: [$(this).attr('guid')]
                    },
                    /*callback: function (obj) {
                        //TODO what to do when all is ok!
                    },*/
                    error: function (error) {
                        console.log(this.id + ': An error occurred while executing microflow: ' + error.description);
                    }
                }, this);

            });

            if (this.buttonCount) {
                $(this.domNode).on('click', '.buttonTwo', function () {
                    mx.data.action({
                        params: {
                            applyto: 'selection',
                            actionname: window.mfBtnTwo,
                            guids: [$(this).attr('guid')]
                        },
                        /*callback: function (obj) {
                        //TODO what to do when all is ok!
                    },*/
                        error: function (error) {
                            console.log(this.id + ': An error occurred while executing microflow: ' + error.description);
                        }
                    }, this);

                });

            }
        },




        _loadList: function (message) {
            var _listOfAll = "",
                attrsList = this.attrs,
                hold, contentBuild;
            mx.data.action({
                params: {
                    actionname: this.mfGetData
                },
                callback: lang.hitch(this, function (objs) {
                    for (var i in objs) {
                        contentBuild = '';
                        for (var j in attrsList) {
                            contentBuild += '<span class="contLines '; 
                            contentBuild += j==0 ? 'firstCont' : '';
                            contentBuild += ' "> ';  
                            contentBuild += this.includeLabels && j != 0 ? attrsList[j]['term'] + ": " : "" ; 
                            if( typeof objs[i].get(attrsList[j]['term']) == "number"){
                                var dateObj = new Date ( objs[i].get(attrsList[j]['term']) )
                                contentBuild += dateObj.toLocaleDateString() + '</span><br/>';
                            }
                            else{
                                contentBuild += objs[i].get(attrsList[j]['term']) + '</span><br/>';
                            }
                        }
                        hold = widgetTemplate.split('{{content}}').join(contentBuild);
                        hold = hold.split('{{guid}}').join(objs[i].getGuid());
                        _listOfAll += hold;
                    }
                    totalList = totalList.split('{{listItems}}').join(_listOfAll);
                    totalList = totalList.split('{{one}}').join(this.buttonOneName);
                    totalList = totalList.split('{{two}}').join(this.buttonTwoName);
                    $(this.domNode).html(totalList);

                    console.log("call back of data");
                    this._setupEvents();
                })
            });

            console.log("Swipe Widget - Loaded list into dom");
        }


    });
});
require(['SwipeList/widget/SwipeList'], function () {
    'use strict';
});