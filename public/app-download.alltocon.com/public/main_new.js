/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }
  if (/android/i.test(userAgent)) {
    return 'Android';
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }
  return 'unknown';
}

var browser = {
  versions: (function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == ' qq', //是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};

function is_weixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

var loc = window.location.href;
loc = loc.substring(0, loc.lastIndexOf('/'));
var appname = loc.substring(loc.lastIndexOf('/') + 1);
console.log('appname=', appname);
if (!window.aglink) {
  window.aglink = '';
  try {
    var currentUrl = new URL(window.location);
    var searchParams = new URLSearchParams(currentUrl.search);
    if (searchParams.has('aglink')) {
      window.aglink = searchParams.get('aglink');
    }
  } catch (e) {
    console.log(e);
  }
}
if (!window.affiliate) {
  try {
    var currentUrl = new URL(window.location);
    var searchParams = new URLSearchParams(currentUrl.search);
    if (searchParams.has('affiliate')) {
      window.affiliate = searchParams.get('affiliate');
    }
  } catch (e) {
    console.log(e);
  }
}

window.apkUrl = '/release/app-' + appname + '-release.apk';
window.apkUrlH5 = '/release/app-' + appname + '-H5-release.apk';
window.apkUrlYabo = '/release/app-' + appname + '-portrait-release.apk';
var plist = '/manifest.plist';
var plistH5 = '/manifestH5.plist';
var plistYabo = '/manifestYabo.plist';
if (window.aglink && window.aglink.length > 0) {
  window.apkUrl = '/release/app-' + appname + '-release-' + aglink + '.apk';
  plist = '/manifest-' + aglink + '.plist';
}
window.iTunesUrl =
  'itms-services://?action=download-manifest&url=' + loc + plist;
window.iTunesUrlH5 =
  'itms-services://?action=download-manifest&url=' + loc + plistH5;
window.iTunesUrlYabo =
  'itms-services://?action=download-manifest&url=' + loc + plistYabo;
window.downloadLink =
  getMobileOperatingSystem() === 'iOS' ? window.iTunesUrl : window.apkUrl;
window.downloadLinkH5 =
  getMobileOperatingSystem() === 'iOS' ? window.iTunesUrlH5 : window.apkUrlH5;
window.downloadLinkYabo =
  getMobileOperatingSystem() === 'iOS'
    ? window.iTunesUrlYabo
    : window.apkUrlYabo;

function onload() {
  if (window.location.href.startsWith('http:')) {
    console.warn('detect http, redirect to https');
    window.location.href = window.location.href.replace('http:', 'https:');
    return;
  }
  var a = document.getElementById('ios-link');
  if (a) {
    a.href = iTunesUrl;
    if (window.affiliate) {
      a.setAttribute('data-clipboard-text', `affiliate:${window.affiliate}`);
    }

    var iOSQrcode = document.getElementById('ios-qrcode');
    if (iOSQrcode && QRCode) {
      new QRCode(iOSQrcode, {
        text: a.href,
        width: 96,
        height: 96,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
  }

  var a = document.getElementById('ios-H5-link');
  if (a) {
    a.href = iTunesUrlH5;
    if (window.affiliate) {
      a.setAttribute('data-clipboard-text', `affiliate:${window.affiliate}`);
    }

    var iOSQrcode = document.getElementById('ios-qrcode');
    if (iOSQrcode && QRCode) {
      new QRCode(iOSQrcode, {
        text: a.href,
        width: 96,
        height: 96,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
  }

  var a = document.getElementById('ios-Yabo-link');
  if (a) {
    a.href = iTunesUrlYabo;
    if (window.affiliate) {
      a.setAttribute('data-clipboard-text', `affiliate:${window.affiliate}`);
    }

    var iOSQrcode = document.getElementById('ios-qrcode');
    if (iOSQrcode && QRCode) {
      new QRCode(iOSQrcode, {
        text: a.href,
        width: 96,
        height: 96,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
  }

  a = document.getElementById('android-link');
  if (a) {
    a.href = apkUrl;
    if (window.affiliate) {
      a.setAttribute('data-clipboard-text', `affiliate:${window.affiliate}`);
    }

    var androidQrcode = document.getElementById('android-qrcode');
    if (androidQrcode && QRCode) {
      new QRCode(androidQrcode, {
        text: a.href,
        width: 96,
        height: 96,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
  }

  a = document.getElementById('android-H5-link');
  if (a) {
    a.href = apkUrlH5;
    if (window.affiliate) {
      a.setAttribute('data-clipboard-text', `affiliate:${window.affiliate}`);
    }

    var androidQrcode = document.getElementById('android-qrcode');
    if (androidQrcode && QRCode) {
      new QRCode(androidQrcode, {
        text: a.href,
        width: 96,
        height: 96,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
  }

  a = document.getElementById('android-Yabo-link');
  if (a) {
    a.href = apkUrlYabo;
    if (window.affiliate) {
      a.setAttribute('data-clipboard-text', `affiliate:${window.affiliate}`);
    }

    var androidQrcode = document.getElementById('android-qrcode');
    if (androidQrcode && QRCode) {
      new QRCode(androidQrcode, {
        text: a.href,
        width: 96,
        height: 96,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
  }

  var pageUrlEle = document.getElementById('page-url');
  if (pageUrlEle) {
    pageUrlEle.innerText = window.location.href;
  }

  try {
    if (ClipboardJS) {
      let clipboard = new ClipboardJS('.copy-action');
      clipboard.on('success', function (e) {
        var copied = document.getElementById('copied-msg');
        copied.classList.add('copied');

        setTimeout(function () {
          copied.classList.remove('copied');
        }, 2000);
      });

      // Copy affiliate code
      if (window.affiliate) {
        let clipboardAgent = new ClipboardJS('.copy-affiliate');
        clipboardAgent.on('success', function (e) {
          console.info('Action:', e.action);
          console.info('Text:', e.text);
          console.info('Trigger:', e.trigger);
        });
      }
    }
  } catch (e) {}

  try {
    var currentUrl = new URL(window.location);
    var searchParams = new URLSearchParams(currentUrl.search);
    console.log('searchParams=', searchParams);
    var iosStepPop = document.getElementById('dsdsd');
    if (
      iosStepPop &&
      (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios)
    ) {
      if (searchParams && searchParams.has('enterstep')) {
        iosStepPop.style.display = 'block';

        searchParams.delete('enterstep');
        var stateObj = {};
        var newUrl =
          currentUrl.protocol +
          '//' +
          currentUrl.host +
          currentUrl.pathname +
          '?' +
          searchParams.toString();
        console.log('newUrl = ', newUrl);
        history.pushState(stateObj, '', newUrl);
      } else {
        iosStepPop.style.display = 'none';
      }

      document.getElementById('wh_close').onclick = function () {
        iosStepPop.style.display = 'none';
      };
    }
  } catch (e) {
    console.log(e);
  }

  try {
    if (is_weixin()) {
      var weixinTip = `<div id="wechat-go" style="display: block; position: absolute; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7);">
          <img style="width: 100%; height: auto;" src="../public/wechat-go.png"/></div>`;
      $('body').append(weixinTip);
    }
  } catch (e) {
    console.log(e);
  }
}

function copyToClipboard(string) {
  let textarea;
  let result;

  try {
    textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', true);
    textarea.setAttribute('contenteditable', true);
    textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand('copy');
  } catch (err) {
    console.error(err);
    result = null;
  } finally {
    document.body.removeChild(textarea);
  }

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
    result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
    if (!result) {
      return false;
    }
  }
  return true;
}

function openDetectAgentAndHref(url) {
  var searchParams = new URLSearchParams(window.location.search);
  var agentId = searchParams.get('agt');
  var ulagentId = searchParams.get('uagt');

  try {
    var copyText = 'uagt=';
    if (ulagentId) {
      console.log('active uagent');
      copyText = 'uagt=' + ulagentId;
      copyToClipboard(copyText);
    } else if (agentId) {
      console.log('active agent');
      copyText = 'agt=' + agentId;
      copyToClipboard(copyText);
    } else {
      console.log('not need copy');
    }
    window.location.href = url;
  } catch (err) {
    window.location.href = url;
    console.log(err);
  }
}

function openPlistLink(linkUrl){
    window.location.href =
        'itms-services://?action=download-manifest&url=' + linkUrl;
}

function openDetectAgentWithFileNamePlatform(platform, fileName) {
  var searchParams = new URLSearchParams(window.location.search);
  var agentId = searchParams.get('agt');
  var ulagentId = searchParams.get('uagt');

  try {
    var copyText = 'uagt=';
    if (ulagentId) {
      console.log('active uagent');
      copyText = 'uagt=' + ulagentId;
      copyToClipboard(copyText);
    } else if (agentId) {
      console.log('active agent');
      copyText = 'agt=' + agentId;
      copyToClipboard(copyText);
    } else {
      console.log('not need copy');
    }
    if (platform == 'ios') {
      window.location.href =
        'itms-services://?action=download-manifest&url=' +
        window.location.protocol +
        '//' +
        window.location.hostname +
        window.location.pathname +
        fileName;
    } 
    else if(platform == "config"){
      window.location.href =
        window.location.protocol +
        '//' +
        window.location.hostname +
        window.location.pathname +
        fileName;
    }
    else {
      window.location.href =
        window.location.protocol +
        '//' +
        window.location.hostname +
        '/release/' +
        fileName;
    }
  } catch (err) {
    window.location.href = url;
    console.log(err);
  }
}

function openDetectAgentWithFileName(fileName) {
  var searchParams = new URLSearchParams(window.location.search);
  var agentId = searchParams.get('agt');
  var ulagentId = searchParams.get('uagt');

  try {
    var copyText = 'uagt=';
    if (ulagentId) {
      console.log('active uagent');
      copyText = 'uagt=' + ulagentId;
      copyToClipboard(copyText);
    } else if (agentId) {
      console.log('active agent');
      copyText = 'agt=' + agentId;
      copyToClipboard(copyText);
    } else {
      console.log('not need copy');
    }
    
      window.location.href =
        window.location.protocol +
        '//' +
        window.location.hostname +
        '/release/' +
        fileName;
    
  } catch (err) {
    window.location.href = url;
    console.log(err);
  }
}

window.addEventListener('load', function () {
  var searchParams = new URLSearchParams(window.location.search);
  var agentId = searchParams.get('agt');
  var ulagentId = searchParams.get('uagt');

  if (agentId || ulagentId) {
    var $copy = document.createElement('div');
    $copy.style.position = 'absolute';
    $copy.style.left = '-10000px';
    $copy.style.top = '-10000px';
    $copy.setAttribute('id', 'copy-agent-id');

    if (ulagentId) $copy.textContent = 'uagt=' + ulagentId;
    else $copy.textContent = 'agt=' + agentId;

    document.body.appendChild($copy);

    function copyAgentId(e) {
      var range = document.createRange();
      range.selectNode($copy);
      window.getSelection().addRange(range);
      try {
        document.execCommand('copy');
      } catch (error) {}
      window.getSelection().removeAllRanges();
    }

    var agtCopyIds = [
      'ios-link',
      'ios-H5-link',
      'ios-Yabo-link',
      'android-link',
      'android-H5-link',
      'android-Yabo-link',
      'ios-guide',
    ];
    agtCopyIds.forEach((id) => {
      var $element = document.getElementById(id);
      if ($element) {
        $element.addEventListener('click', copyAgentId);
      }
    });
  }
});
