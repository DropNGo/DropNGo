window.adFeedback = window.adFeedback || {};
window.adFeedback.initializeSponsoredLabel = (feedbackDivId) => {

    try {
        const changeLinkColor = () => {
            document.getElementById(`ad-feedback-text-${feedbackDivId}`).style.color = '#111111';
            document.getElementById(`ad-feedback-sprite-${feedbackDivId}`).style.background = `transparent url("https://m.media-amazon.com/images/G/01/ad-feedback/info_icon_1Xsprite.png") no-repeat 0px -12px`;
        }
        const onClick = () => {
            P.when('A').execute( function(A) {

                A.on('a:popover:beforeShow', function() {
                    if(window.uet) {
                        window.uet('bb', 'adFeedbackSpLabelLibrary:desktop:feedbackForm:time', {wb: 1});
                    }
                });

                A.on('a:popover:ajaxStart', function() {
                    if(window.uet) {
                        window.uet('bb', 'adFeedbackSpLabelLibrary:desktop:ajaxLatency', {wb: 1});
                    }
                });

                A.on('a:popover:ajaxSuccess', function() {
                    if(window.ue && window.ue.count) {
                        window.ue.count("adFeedbackSpLabelLibrary:desktop:feedbackForm:success", 1);
                    }
                    if(window.uet) {
                        window.uet('be', 'adFeedbackSpLabelLibrary:desktop:ajaxLatency', {wb: 1});
                        window.uet('be', 'adFeedbackSpLabelLibrary:desktop:feedbackForm:time', {wb: 1});
                    }
                    if(window.uex) {
                        window.uex('ld', 'adFeedbackSpLabelLibrary:desktop:feedbackForm:time', {wb: 1});
                    }
                });

                A.on('a:popover:ajaxFail', function() {
                    if(window.ue && window.ue.count) {
                        window.ue.count("adFeedbackSpLabelLibrary:desktop:feedbackForm:failure", 1);
                    }
                    if(window.uet) {
                        window.uet('be', 'adFeedbackSpLabelLibrary:desktop:ajaxLatency', {wb: 1});
                        window.uet('be', 'adFeedbackSpLabelLibrary:desktop:feedbackForm:time', {wb: 1});
                    }
                    if(window.uex) {
                        window.uex('ld', 'adFeedbackSpLabelLibrary:desktop:feedbackForm:time', {wb: 1});
                    }
                });
            });
        }

        var defaultLinkBehaviour = function() {
            document.getElementById(`ad-feedback-text-${feedbackDivId}`).style.textDecoration = 'none';
            document.getElementById(`ad-feedback-text-${feedbackDivId}`).style.color = '#555555';
            document.getElementById(`ad-feedback-sprite-${feedbackDivId}`).style.background = `transparent url("https://m.media-amazon.com/images/G/01/ad-feedback/info_icon_1Xsprite.png") no-repeat scroll 0px 0px`;
        }

        const addFocusStyling = function () {
            document.getElementById(`af-label-primary-link-${feedbackDivId}`).style.outline = '3px solid #35798a';
            document.getElementById(`af-label-primary-link-${feedbackDivId}`).style.borderRadius = '5px';
        }

        const removeFocusStyling = function () {
            document.getElementById(`af-label-primary-link-${feedbackDivId}`).style.outline = 'none';
            document.getElementById(`af-label-primary-link-${feedbackDivId}`).style.borderRadius = '0';
        }

        window[`sponsoredLabel_${feedbackDivId}`] = window[`sponsoredLabel_${feedbackDivId}`] || {};
        window[`sponsoredLabel_${feedbackDivId}`]['onMouseHover'] = changeLinkColor;
        window[`sponsoredLabel_${feedbackDivId}`]['onMouseOut'] = defaultLinkBehaviour;
        window[`sponsoredLabel_${feedbackDivId}`]['onClick'] = onClick;
        window[`sponsoredLabel_${feedbackDivId}`]['onFocus'] = addFocusStyling;
        window[`sponsoredLabel_${feedbackDivId}`]['onBlur'] = removeFocusStyling;
    } catch(ex) {
        if(window.ueLogError) {
            var additionalInfo = {
                logLevel : 'ERROR',
                attribution : 'Ad Feedback',
                message : 'Error in Feedback js '
            };
            window.ueLogError(ex, additionalInfo);
        }
    }
};
