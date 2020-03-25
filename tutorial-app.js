// var app = http.createServer(function(request,response){
//     var url = request.url;
//     if(request.url == '/'){
//       url = '/index.html';
//     }
//     if(request.url == '/favicon.ico'){
//       response.writeHead(404);
//       response.end();
//       return;
//     }
//     response.writeHead(200);
//     response.end(fs.readFileSync(__dirname + url));
//
// });

const express = require('express');//4.16.3
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');//POST 사용시 req객체에 body라는 항목을 추가하는 모듈
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(morgan('common'));//로거 모듈
app.use(bodyParser.json({limit: '50mb'}));//body parser config 작성
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//스태틱 파일 제공, 이 디렉토리 안의 파일은 하람이 형이 만들어준 서버처럼
//URL을 통해 스태틱 파일을 제공할 수 있어.

//DB 정보 작성
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'tjsdn',
    database : 'nsw'
});
//DB에 연결
conn.connect();

app.get('/', (req, res) =>{
    //index.html는 public 폴더에 넣었고 main.html로 변경했어
    let tags = '';
    let prefix = `<html>
    <head>
        <style>
        div{
            float: left;
            width: 30%;
            background-color: rgba(0, 0, 0, .1);
            margin-left: 10%;
        }
        p{
            padding-left: 10px;
            background-color: rgba(0, 0, 0, .2);
        }
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        b{
            margin-left: 20px;
        }
        </style>
    </head>
    <body>
    <div>`;
    let postfix = `</div><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/><image src="/images/KFC.jpg"/></body></html>`;

    tags += `<p><a href = '/readme'>README</a></p>`
    tags += `<b>개요</b>`
    tags += `<p><a href = '/test/1'>예제1</a></p>`;
    tags += `<b>GET 라우터 실습 1</b>`;
    tags += `<p><a href = '/test/2'>예제2</a></p>`;
    tags += `<b>GET 라우터 실습 2</b>`;
    tags += `<p><a href = '/test/qs/org/'>예제3.1</a></p>`;
    tags += `<b>GET 라우터 실습 : 쿼리스트링을 통한 입력</b>`;
    tags += `<p><a href = '/test/qs/smt/0'>예제3.2</a></p>`;
    tags += `<b>GET 라우터 실습 : 쿼리스트링을 통한 입력(시멘틱 URL)</b>`;
    tags += `<p><a href = '/whatIs/public'>예제4</a></p>`;
    tags += `<b>public 접근이란</b>`;
    tags += `<p><a href = '/whatIs/post'>예제5</a></p>`;
    tags += `<b>POST 라우터 실습 1</b>`;
    tags += `<p><a href = '/whatIs/post2'>예제6</a></p>`;
    tags += `<b>POST 라우터 실습 2 : aJax</b>`;
    tags += `<p><a href = '/test/db'>예제7</a></p>`;
    tags += `<b>DB 실습</b>`;
    tags += `<p><a href = '/test/etc'>et cetera</a></p>`;
    tags += `<b>그외에 세련된 방법들</b>`;
    tags = prefix + tags + postfix;
    res.send(tags);
});

//예제 1: GET 라우터 익명 함수를 통한.
app.get('/readme', (req, res) =>{
    res.send(`
            <head>
            <style>
            a{
                font-size: 1.25em;
                text-decoration: none;
                color: #dd4c39;
            }
            a:hover{
                color : #9a3527;
            }
            </style>
            </head>
            <a href='/'>홈으로</a>
            <p>
            이전에 사용하던 http 서버는 static 서버로 미리 만들어둔 html파일들을 제공만 하는 랜딩페이지만 가지는 서버에서 주로 사용해.
            <br>
            이제는 데이터를 주고 받아야 하기때문에 그보다 편한 express라는 프레임워크를 사용할거야.
            </p>
            <b>졸작을 하려면 뭐를 배워야하지?</b>
            <ul>
                <li>1. 브라우저 위에서 동작하는 언어 : HTML / CSS / JavaScript와 프론트엔드 라이브러리 JQuery의 대략적인 사용법</li>
                <li>2. 서버 단의 언어 : Node.js, 기본적으로 브라우저 JS와 유사하지만 라이브러리의 사용법에 중점을 두는게 좋아.</li>
                <li>3. DB서버의 SQL : MySQL 간단한 문법정도</li>
            </ul>
            <p>
            <b>용어 설명 :</b><br><br>
            클라이언트 자바스크립트 : chrome이나 IE, safari등 브라우저 위에서 쓰는 JS<br>
            서버 자바스크립트 : nodejs를 말해<br>
            유튜브 : 생활코딩 - 웹 프로그래밍 편을 쭉 보면 설명 잘되어 있어<br><br>
            형식 :: app.method(route, callback(req, res, next))<br><br>
            <b>#1. method</b>가 뭐야?<br><br>
            method에는 크게 4가지로 get, post, put, delete가 있어 이 4가지를 적절하게 사용하는 서버를 REST API라고 하는데<br>
            우리는 API서버를 따로 만들지 않을 거기 하기때문에 get과 post만을 사용하자.<br><br>
            get과 post의 가장 큰 차이점은 보안이야 get 같은 경우는 서버와 통신을 평문으로 하기 때문에 보안 이슈로 사용자의 데이터를 받을 때는 사용하지 않아.<br>
            get은 C라고 치면 최종적으로 printf() 할 페이지라고 생각하면 돼.<br><br>
            post는 반대로 서버와 통신을 서버 내부에서 하기때문에 외부에서 훔쳐보기 힘들어 그래서 사용자 데이터를 받을 때 사용하는 메소드야.<br>
            post는 C라고 치면 scanf()하는 페이지라고 생각하면 돼.<br>
            </p>
            <br>
            <p>
            <b>#2. route가 뭐야?</b><br><br>
            웹 서버에서 router라고 하면 통상적으로 URL을 가르켜. express에서는 복잡한 서버(/route1/sub-route/.... 이런식으로 길어지는 서버들)를 염두에 두고 개발하기 때문에 Router 라는 객체를 인스턴스화해서 사용하는게 원칙이지만, 간단한 서버를 개발할 것이기 때문에 복잡한 방식은 채택하지 않았어.<br>
            지금은 URL이라고 생각하고 작업하는 게 편해.<br>
            </p>
            <br>
            <p>
            <b>#3. callback이 뭐야?</b><br><br>
            함수의 인자로 함수를 전달하는 것을 말해.<br>
            이전에 객체지향 수업에서 자바 공부하면서 객체라는 것을 배웠었잖아?<br>
            자바에서는 객체를 함수의 인자로 전달하고 또 return 할 수 있었어.<br><br>
            자바스크립트에서도 마찬가지야 하지만 조금 더 확장되서 함수를 1급 객체 취급하기 떄문에 함수의 인자로 함수를 전달하는 하여 사용하는게 일반적이고 다른 언어에서는 람다라고도 하는 익명함수를 자주 사용해.<br><br>
            express에서는 HTTP통신을 간단화 해서 사용자의 요청과 그에 대한 서버의 답변을 각각 함수의 첫번째 인자, 두번째 인자에 전달하기로 약속해놨어.<br>
            궁금할 시에는 google에서 npm express를 검색해서 reference를 읽어보자.<br><br>
            필수 :<br>
                req.params : GET 방식을 통해 데이터를 받을 시 데이터가 들어오는 변수<br>
                req.body : POST 방식을 통해 데이터를 받을 시 데이터가 들어오는 변수<br>
                (body-parser) 모듈이 깔려있을 때만 사용할 수 있음.<br><br>

                res.send(arg): arg를 반환<br>
                res.json(arg): arg가 json 형태인 경우에 사용<br>
            </p>
            <br>
            <p>
            <궁금할 시에만 읽자> 왜 callback을 사용해?<br>
            자바스크립트가 비동기 방식을 채용하기 하기때문에 일련의 과정을 하고나서 내가 마지막에 원하는 형태로 가공할때에 그것을 함수를 통해 해결하는 방식이 대표적이야.<br>
            이러한 비동기 성때문에 promise와 async/await가 추가되었어.<br>
            클라이언트 자바스크립트에서는 기본적으로는 async/await는 아직 사용할수 없지만 promise를 이용해서 해결하는 경우가 통상적이야.<br>
            </p>
        `);
})

app.get('/test/1', (req, res) =>{
    console.log('route successed root');
    res.send(`
        <head>
        <style>
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
        </head>
        <h1>Hello Example 1!</h1>
        <p>GET 라우터의 경우는 브라우저로 연결하는 라우터야.</p><p>app.get(X, Y)로 X 부분에는 원하는 URL, Y부분에는 그에대한 응답을 작성하는게 기본!</p><p>Y는 함수형으로 제공해야 하는데, (req, res, next, ...) 같은 형태야.</p><p>꼭 req, res일 필요는 당연히 없구 next같은 경우 라우터를 미들웨어로 써야할 경우 추가해서 쓰면돼.</p>
        <a href='/'>홈으로</a>
        `);
});

//예제 2 GET 라우터 함수를 이용한.
let foo = (req, res) =>{
    res.send(`
        <head>
        <style>
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
        </head>
        <h1>Bar</h1>
        <p>익명 함수를 쓰는게 일반적이지만, handler 형태로 함수를 따로 빼고 싶다면 상관없어.</p>
        <a href='/'>홈으로</a>
        `);
};

app.get('/test/2', foo);

//예제 3 : 쿼리 스트링을 통한 입력
app.get('/test/qs/org', (req, res) =>{

    res.send(`
    <html>
        <head>
        <style>
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
        </head>
        <body>
            <div>
                <p><a href = '/test/qs/org?value=1'>쿼리스트링 입력 : 1</a></p>
                <p><a href = '/test/qs/org?value=2'>쿼리스트링 입력 : 2</a></p>
                <p><a href = '/test/qs/org?value=3'>쿼리스트링 입력 : 3</a></p>
                <p>VALUE=${req.query.value}</p>
                <p>현재 주소 = /test/qs/org?value=${req.query.value}</p>
                <a href = '/'>홈으로</a>
            </div>
            <div>
            <p>a tag는 anchor tag라는 뜻으로 URL를 기본적으로 변경하는 태그야.</p>
            <p>함수에 바인딩하거나 보고 있는 페이지의 위 아래로 이동하는 용도로도 사용해 href 속성에 URL을 주면 그곳으로 이동할 수 있어.</p>
            <p>크롬이라면 Ctrl + Shift + I, IE라면 F10 이나 F11, Safari는 몰라 여튼 눌러보자</p>
            <p>a tag에 href라는 HTML 표준속성이 있지?<br>
            이건 어디로 연결할까에 대한 목적지야. 기본적으로 웹 페이지는 이러한 연결 태그를 통해 동작해</p>
            <p>그렇다면 이 URL에 데이터를 끼얹을 수도 있을까?<br>
            답은 예쓰 빠끄! key=value&key2=value2 형태를 고전적인 형태의 쿼리 스트링이라고 해</p>
            <p>express 모듈을 통해 req객체의 query라는 곳에 저장이되고 req.query.key_name 형식으로 참조할 수 있어.</p>
            <p>위에 링크들을 눌러보자.
            </div>
        </body>
    </html>
    `);
});

//예제 3-2 : 시멘틱 URL - 쿼리 스트링의 확장
app.get('/test/qs/smt', (req, res) =>{

    res.send(`
    <html>
        <head>
        <style>
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
        </head>
        <body>
            <div>
                <p><a href = '/test/qs/smt/1'>쿼리스트링 입력 : 1</a></p>
                <p><a href = '/test/qs/smt/2'>쿼리스트링 입력 : 2</a></p>
                <p><a href = '/test/qs/smt/3'>쿼리스트링 입력 : 3</a></p>
                <p>VALUE=${req.params.value}</p>
                <p>현재 주소 = /test/qs/smt</p>
                <a href = '/'>홈으로</a>
            </div>
            <div>
            <p>URL?key=value&key2=value2 형태를 고전적인 형태의 쿼리 스트링이라고 한다고 했어</p>
            <p>요즘에는 어떤 형식으로 쿼리스트링을 쓸까? 다시 한번 URL이 바뀌는 것을 봐바</p>
            <p>아래 예제처럼 URL을 보고 입력 값을 알 수 있다고 해서 시멘틱 URL이라고 불러. 쿼리스트링의 개량버전이라고 보면 돼</p>
            <p>express 모듈을 통해 req객체의 params라는 곳에 저장이되고 req.params.key_name 형식으로 참조할 수 있어.</p>
            <p>눌러보자</p>
            </div>
        </body>
    </html>
    `);
});
app.get('/test/qs/smt/:value', (req, res) =>{
    //get 메소드에서는 ':변수명' 형태로 URL을 통해 값을 입력 받을 수 있어
    //여기서 이런 형태를 쿼리스트링이라고 부르기도해,
    //URL?key=value&key2=value2 형식으로 사용하는 쿼리스트링도 있지만 여기서는 안할거야
    let value = req.params.value;
    //URL은 express 모듈을 통해 req객체의 params라는 곳에 저장이되고
    console.log('route successed /test/qs' + ` value : ${value}`);
    let simplePTag = `<p> Hello query string=${value}</p>`;//p tag를 하나 만들었어

    //정규 html 폼으로 만들어 보자
    let prefix = `<html><head>
    <style>
    a{
        font-size: 1.25em;
        text-decoration: none;
        color: #dd4c39;
    }
    a:hover{
        color : #9a3527;
    }
    </style>
    </head><body><div>`;
    let postfix = `
    <p><a href = '/test/qs/smt/1'>쿼리스트링 입력 : 1</a></p>
    <p><a href = '/test/qs/smt/2'>쿼리스트링 입력 : 2</a></p>
    <p><a href = '/test/qs/smt/3'>쿼리스트링 입력 : 3</a></p>
    <p>VALUE=${req.params.value}</p>
    <p>현재 주소 = /test/qs/smt/value/${req.params.value}</p>
    <p><a href = '/test/qs/smt/'>이전으로</a></p>
    <p><a href = '/'>홈으로</a></p>
    </div>
    <div>
    <p>URL?key=value&key2=value2 형태를 고전적인 형태의 쿼리 스트링이라고 한다고 했어</p>
    <p>요즘에는 어떤 형식으로 쿼리스트링을 쓸까? 다시 한번 URL이 바뀌는 것을 봐바</p>
    <p>아래 예제처럼 URL을 보고 입력 값을 알 수 있다고 해서 시멘틱 URL이라고 불러. 쿼리스트링의 개량버전이라고 보면 돼</p>
    <p>express 모듈을 통해 req객체의 params라는 곳에 저장이되고 req.params.key_name 형식으로 참조할 수 있어.</p>
    <p>눌러보자</p>
    </div>
    </body></html>`;

    let result = '';
    for(let i=0; i<5; i++) result += simplePTag;//P tag를 다섯개로 뿔려보자

    res.send(prefix + result + postfix);//다른 언어에서의 함수의 reture 값이라고 생각하면 돼
});

app.get('/whatIs/public', (req, res) =>{

    res.send(`
    <html>
    <head>
    <style>
    a{
        font-size: 1.25em;
        text-decoration: none;
        color: #dd4c39;
    }
    a:hover{
        color : #9a3527;
    }
    </style>
    </head>
    <body><div>
    <p><a href = '/main.html'>퍼블릭 리소스 접근(/main.html)</a></p>
    <p>퍼블릭 리소스는 static(정적, 입력값에 따라 바뀌지 않는 페이지)하게 제공하도록 해놨어</p>
    <div>
    <p>하람이 형이 긁어온 소스들을 public 이라는 폴더에 넣어놨어 서버 소스(app.js)에서</p>
    <p><b>app.use(express.static(path.join(__dirname, 'public')));</b></p>
    <p>이라는 구문을 통해서 public이라는 폴더에 들어있는 리소스(html/css/js 등)은 라우터를 통하지 않고 static 형식으로 접근하게 했어</p>
    <p>index.html을 main.html으로 변경한 이유는, 웹 서버는 기본적으로 루트 라우터에서 index.html을 응답하는 것이</p>
    <p>약속 되어있는데, 형이 보고 있는 페이지를 제공하기 위해서 main.html으로 바꿔놓은 거야.</p>
    </div>
    <p><a href = '/'>홈으로</a></p>
    </div></body>
    </html>`);
});

//예제 4 : POST 라우터
app.get('/whatIs/post', (req, res) =>{
    res.send(`
        <head>
        <style>
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
        </head>
        <form action="/test/post" method='POST'>
            First name:<br>
            <input type="text" name="firstname" value="Mickey">
            <br>
            Last name:<br>
            <input type="text" name="lastname" value="Mouse">
            <br><br>
            <input type="submit" value="Submit">
        </form>
        <p>POST의 경우에는 form을 통해 정보를 입력받는 것이 통상적이야</p>
        <p>일반적인 웹 페이지에서 POST 방식으로 연결되는 페이지(우리가 보는 페이지)는 정말 드물어</p>
        <p><a href = '/test/post'>여기</a>를 눌러보자, 아마 페이지를 찾을 수 없을거야</p>
        <p>특수한 브라우저나 크롤러같은 콘솔 형식 접속이 아니라면 POST 페이지에는 form을 통해서 접근해야해</p>
        <p><a href = '/'>홈으로</a></p>
    `);
});

app.post('/test/post', (req, res) =>{
    //POST 라우터는 새로고침 없이 어떤 데이터를 갱신하고 싶을 때 사용하는게 일반적.
    //form을 통해 데이터를 받아서 사용할 수 있어. a tag로 연결하는 페이지는 아니야.
    //보여주기 위한 페이지라기 보다는 데이터를 넘겨 받는 어떤 공간이라고 생각하면 쉬워.
    let data = req.body;
    res.send(data);
});

app.get('/whatIs/post2', (req, res) =>{
    let header = `
    <html>
    <head>
        <script src="//code.jquery.com/jquery.min.js"></script>
        <style>
        #target{
            background-color: #dd4c39;
            color: white;
        }

        #btn{
            background-color: #dd4c39;
            color: white;
        }
        #btn:hover{
            background-color: #9a3527;
            color: rgba(0,0,0,.4);
        }
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
        </head>
    </head>
    `;

    let html = `
        <body>
            <div id="target">DONE NOTHING YET</div>
            <form action="/test/post" method='POST' id='form1'>
                First name:<br>
                <input type="text" name="firstname" value="Mickey">
                <br>
                Last name:<br>
                <input type="text" name="lastname" value="Mouse">
                <br><br>
            </form>
            <a id='btn' href='#'>호출!</a>
            <p><a href = '/'>홈으로</a></p>
            <div>
            POST 라우터는 새로고침 없이 어떤 데이터를 갱신하고 싶을 때 사용하는게 일반적.<br>
            form을 통해 데이터를 받아서 사용할 수 있어. a tag로 연결하는 페이지는 아니야.<br>
            보여주기 위한 페이지라기 보다는 데이터를 넘겨 받는 어떤 공간이라고 생각하면 쉬워.<br>
            코드에 주석이 좀 있으니까 읽어보면 도움이 될거야.<br>
            </div>
        </body>
    </html>
    `;

    let js = `
    <script>
        $('#btn').on('click', (e)=>{
            let formData = $("#form1").serialize();

            $.ajax({
                    url: "/test/post",
                    data: formData,
                    method: "POST",
                    dataType: "json"
            })
            .done(function(res){
                let fn = res.firstname;
                let ln = res.lastname;
                let result = '';
                result += '<p>first name :' + fn + '</p>';
                result += '<p>last name : ' + ln + '</p>';
                $('#target').html(result);
            })
            .fail(function(xhr, status, errorThrown){
                alert('Error occurs!');
            });
        });
    </script>
    `;

    //script를 통해 /test/post는 보내준 데이터를 바로 응답하는 에코 라우터야.
    //form을 사용해 POST URL을 통해 btn이라는 id를 가진 태그의 내용을 바꿔주고 있어.
    //
    //.on(click, (e) => ...) 부분은 해당 태그에 이벤트를 붙여주는 과정이야.
    //'$' 표시는 JQuery라는 라이브러리의 예약어이고
    //$('x')로 x라는 DOM 객체를 불러올 수 있어.
    //
    //이후 붙는 .done(), .fail() 등은 ajax 메소드의 예약 함수들인데
    //각각 요청한 이벤트가 끝났을때, 실패했을 때 실행할 함수를 지정할 수 있어.
    //.으로 이어지는 과정을 chaining 이라고 부르고, 이는 JS의 Promise라는
    //것과 깊은 관련이있는데, 궁금하면 검색해보고 깊이는 몰라도 상관없어!
    //
    //#이나 .은 각각 id, class를 가르키는 예약어야.
    //이건 W3C school의 css selector(선택자)를 검색해서 알아보자.
    //
    //<style> 로 감싸진 부분을 CSS라고 하고
    //<script>로 감싸진 부분을 JS(JavaScript)라고 해.
    res.send(header + html + js);
});

app.get('/test/db', (req, res) =>{
    let header = `
    <html>
    <head>
        <script src="//code.jquery.com/jquery.min.js"></script>
        <style>
        .container{
            width: 600px;
            padding: 5px 5px 5px 5px;
            background-color: #dd4c39;
            color: white;
        }

        #target{
            border: 4px rgba(0,0,0,.4) solid;
            background-color: #dd4c39;
            color: white;
        }

        #target p{
            margin-top: 4px;
            margin-bottom: 4px;
        }

        #form1{
            width: 500px;
            padding: 10px 0px 10px 100px;
            border: 4px rgba(0,0,0,.4) solid;
        }

        .btns{
            text-decoration:none;
            margin-right: 15px;
            background-color: #dd4c39;
            color: white;
            border-top: 1px rgba(255,255,255,.4) solid;
            border-left: 2px rgba(255,255,255,.4) solid;
            border-bottom: 4px rgba(0,0,0,.4) solid;
            border-right: 4px rgba(0,0,0,.4) solid;
        }

        .btns:hover{
            background-color: #9a3527;
            color: rgba(0,0,0,.4);
        }

        #comment{
            width: 80%;
            margin: 10px 0px 10px 100px;
            border: 4px rgba(0,0,0,.4) solid;
            background-color: #dd4c39;
            color: white;
        }
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
    </head>
    `;

    let html = `
        <body>
            <div class="container">
            <h1>DATA SECTION BELOW</h1>
            <div id="target">DONE NOTHING YET</div>
            </div>
            <br>
            <form action="/test/post" method='POST' id='form1'>
                <b>id(조회/갱신/삭제):</b><br>
                <input type="text" name="id" value="1">
                <br><br>
                <b>name(생성/갱신):</b><br>
                <input type="text" name="name" value="default">
                <br>
            </form>
            <a class='btns' id='create' href='#'>(C)생성</a>
            <a class='btns' id='read' href='#'>(R)조회</a>
            <a class='btns' id='readAll' href='#'>(R)모두 조희</a>
            <a class='btns' id='update' href='#'>(U)갱신</a>
            <a class='btns' id='delete' href='#'>(D)제거</a>
            <p><a href = '/'>홈으로</a></p>
            <div>
            DB의 연산은 기본적으로 4가지로 구분하고 있어.<br>
            CRUD에 대한 축약어 해석은 여러가지가 있지만 내가 사용하는 CRUD의 의미는 아래와 같아.<br>
            <ul>
                <li>C : Create(생성)</li>
                <li>R : Read(조회)</li>
                <li>U : Update(갱신)</li>
                <li>D : Delete(제거)</li>
            </ul>
            이중 Create와 Update는 요즘에 insert, update로 해석하기 보다는 upsert(없으면 만들고, 있으면 갱신한다)라는 연산을 자주 사용해.<br>
            여기서는 그런 거 없이 4개 연산 전부 다 구현할꺼야.<br>
            이 예제의 서버 코드 아래쪽에 있는 4가지 라우터들이 각각을 담당해.<br>
            이외에 ORM이라는 방식으로 Fetch 하는 방법도 있지만, 여기서는 맨땅에 헤딩해보도록하자<br>
            </div>
            <div class="container">
            <h3>COMMENT</h3>
            <div id='comment'>DO SOMETHING FIRST</div>
            </div>

        </body>
    </html>
    `;

    let js = `
    <script>
        $('#create').on('click', (e)=>{
            let formData = {
                    'name' : $("input[name=name]").val()
            };

            console.log('create name', formData);

            $.ajax({
                    url: "/api/test/create",
                    data: formData,
                    method: "POST",
                    dataType: "json"
            })
            .done(function(res){
                $('#target').html('<p>DONE!</p>');
                $('#comment').html('<p>insert 구문같은 경우에는 1개 혹은 여러개의 row를 삽입할때 사용해. 응답하는 rows에는 여러 정보들이 있기때문에, SQL이 잘 작동했는지는 err의 유무로 판단하는 것이 좋아.</p><p>바인딩한 URL은 "/api/test/create"이고 조회 페이지는 POST으로 하는 것은 표준 때문에 직접 들어가기 위해서는 별도의 form을 작성해야해. </p><a href="/api/test/create">API 페이지로</a>');
                alert('DONE!');
            })
            .fail(function(xhr, status, errorThrown){
                console.log(xhr);
                alert('Oops, error occurs!');
            });
        });

        $('#read').on('click', (e)=>{
            let formData = $("input[name=id]").val();
            console.log('read name='+formData);

            $.ajax({
                    url: "/api/test/"+formData,
                    data: formData,
                    method: "GET",
                    dataType: "json"
            })
            .done(function(res){
                let result = '<p>id : ' + res.id + ' name : ' + res.name + '</p>';
                $('#target').html(result);
                $('#comment').html('<p>select 쿼리에 where 절에 id를 기준으로 하나의 원하는 row를 fetch 할 수 있어.</p><p>바인딩한 URL은 "/api/test/:id"이고 조회 페이지는 GET으로 하는 것이 표준이기 때문에 직접 볼수 있어.</p><a href="/api/test/'+res.id+'">API 페이지로</a>');
                alert('DONE');
            })
            .fail(function(xhr, status, errorThrown){
                console.log(xhr);
                alert('Oops, error occurs!');
            });

        });

        $('#readAll').on('click', (e)=>{
            console.log('read All');
            $.ajax({
                    url: "/api/test/all",
                    method: "GET",
                    dataType: "text"
            })
            .done(function(res){
                let result = '<div>';
                res = JSON.parse(res);
                for(i in res){
                        let tmp = '<p>id : ' + res[i].id  + ' name : ' + res[i].name + '</p>';
                        result += tmp;
                        console.log(i, tmp);
                }

                result += '</div>';

                $('#target').html(result);
                $('#comment').html('<p>select 쿼리에 where 절을 쓰지 않으면 모든 row를 fetch 할 수 있어.</p><p>바인딩한 URL은 "/api/test/all"이고 조회 페이지는 GET으로 하는 것이 표준이기 때문에 직접 볼수 있어.</p><a href="/api/test/all">API 페이지로</a>');
                alert('DONE');
            })
            .fail(function(xhr, status, errorThrown){
                console.log(xhr);
                alert('Oops, error occurs!');
            });
        });

        $('#update').on('click', (e)=>{
            let formData = {
                    'id' : $("input[name=id]").val(),
                    'name' : $("input[name=name]").val()
            };
            console.log('update', formData);

            $.ajax({
                    url: "/api/test/update",
                    data: formData,
                    method: "POST",
                    dataType: "json"
            })
            .done(function(res){
                $('#target').html('<p>DONE!</p><p>CHECK THE RESULT BY READ IT</p>');
                $('#comment').html('<p>update 구문같은 경우에는 1개 혹은 여러개의 row를 변경할때 사용해. 응답하는 rows에는 여러 정보들이 있기때문에, SQL이 잘 작동했는지는 err의 유무로 판단하는 것이 좋아.</p><b>update 구문과 delete 구문에서는 where 절을 꼼꼼히 확인해야해. 잘못하면 테이블 전체를 날리거나 수정해 버릴 수 있기때문에 where 절이 있는지와, 해당 조건에 걸리는 row를 변경하려는 것인지 확실하게 확인하자.</b><p>바인딩한 URL은 "/api/test/update"이고 조회 페이지는 POST으로 하는 것은 표준 때문에 직접 들어가기 위해서는 별도의 form을 작성해야해. </p><a href="/api/test/update">API 페이지로</a>');
                alert('DONE');
            })
            .fail(function(xhr, status, errorThrown){
                console.log(xhr);
                alert('Oops, error occurs!');
            });
        });

        $('#delete').on('click', (e)=>{
            let formData = {
                    'id' : $("input[name=id]").val()
            };

            $.ajax({
                    url: "/api/test/delete",
                    data: formData,
                    method: "POST",
                    dataType: "json"
            })
            .done(function(res){
                $('#target').html('<p>DONE!</p><p>CHECK THE RESULT BY READ IT</p>');
                $('#comment').html('<p>delete 구문같은 경우에는 1개 혹은 여러개의 row를 삭제할때 사용해. 응답하는 rows에는 여러 정보들이 있기때문에, SQL이 잘 작동했는지는 err의 유무로 판단하는 것이 좋아.</p><b>update 구문과 delete 구문에서는 where 절을 꼼꼼히 확인해야해. 잘못하면 테이블 전체를 날리거나 수정해 버릴 수 있기때문에 where 절이 있는지와, 해당 조건에 걸리는 row를 변경하려는 것인지 확실하게 확인하자.</b><p>바인딩한 URL은 "/api/test/create"이고 조회 페이지는 POST으로 하는 것은 표준 때문에 직접 들어가기 위해서는 별도의 form을 작성해야해. </p><a href="/api/test/delete">API 페이지로</a>');
                alert('DONE');
            })
            .fail(function(xhr, status, errorThrown){
                console.log(xhr);
                alert('Oops, error occurs!');
            });
        });
    </script>
    `;
    res.send(header + html + js);
});

app.post('/api/test/create', (req, res) =>{
    //conn 은 DB에 연결된 한개의 세션이라고 생각하면되.
    //위 구문에서 DB configuration을 작성한대로 원하는 스키마에 접속할 수 있어.
    //위 구문에서 createConnection을 통해 하나의 세션을 발급받는거야.
    //conn.escape같은 경우에는 가장 기본적인 보안책으로 SQL상의 주석구문이나 예약어등을 제거해줘
    //DB injection 공격을 방어하기 위해서 대부분의 DB 세션 모듈들이 제공하는 기능이야.
    let name = req.body.name;
    let query = `insert into test_conn(name) values(${conn.escape(name)});`;

    conn.query(query, (err, rows, fields) =>{
      if(err){
        console.error(err);
        res.status(500);
      }
      else res.send(rows);
    });
});

app.get('/api/test/all', (req, res) =>{
    let query = `select * from test_conn`;

    conn.query(query, (err, rows, fields) =>{
      if(err){
        console.error(err);
        res.status(500);
      }
      else res.send(rows);
    });
});

app.get('/api/test/:id', (req, res) =>{
    let id = req.params.id;
    let query = `select * from test_conn where id=${conn.escape(id)}`;

    conn.query(query, (err, rows, fields) =>{
      if(err){
        console.error(err);
        res.status(500);
      }
      else res.send(rows[0]);
    });
});


app.post('/api/test/update', (req, res) =>{
    let id = req.body.id; let name = req.body.name;
    let query = `update test_conn set name=${conn.escape(name)} where id=${conn.escape(id)}`;

    conn.query(query, (err, rows, fields) =>{
      if(err){
        console.error(err);
        res.status(500);
      }
      else res.send(rows);
    });
});

app.post('/api/test/delete', (req, res) =>{
    let id = req.body.id;
    let query = `delete from test_conn where id=${conn.escape(id)}`;

    conn.query(query, (err, rows, fields) =>{
      if(err){
        console.error(err);
        res.status(500);
      }
      else res.send(rows);
    });
});

app.get('/test/etc', (req, res) =>{
    res.send(`
    <html>
    <head>
        <style>
        a{
            font-size: 1.25em;
            text-decoration: none;
            color: #dd4c39;
        }
        a:hover{
            color : #9a3527;
        }
        </style>
    </head>
    <body><div>
    <p>작업해 놓은 코드를 보면 굉장히 더러운 것을 알 수 있어.</p>
    <p>그 이유는 예제를 만들면서 시간을 적게쓰려구... 사실 중복된 코드의 경우</p>
    <p><a href='https://www.npmjs.com/package/ejs'>ejs</a> 라는 템플릿을 이용하면 pure html등으로 작업하는 것보다는 빠르고 파일 분리가 쉬워져.</p>
    <p><a href='https://expressjs.com/ko/api.html'>express</a>는 사실 nodejs의 MVC 프레임워크야. 하지만 지금 작업해 놓은것은 전혀 MVC가 아니야.</p>
    <p>res.send()내부의 모든 텍스트 내용을 HTML로 혹은 필요하다면 CSS, JS까지 분리해서 조립해 쓰는 방식이 M<b>V</b>C에서는 View의 기본방식이야.</p>
    <p>하지만 ejs같은 view engine은 html, css, JavaScript를 알아야 편하고 작업량이 얼마 되지않는다면 오히려 사용하는 오버헤드가 더 커질수도 있다는 거지</p>
    <p>서버 코드의 최상단을 보면 fs를 붙여놨는데, 사실 res.send 내부의 내용을 정규 HTML로 작성하고 <a href='https://nodejs.org/api/fs.html'>fs read/write</a>를 이용해서 제공하는 방식도 있어.</p>
    <p>ejs보다는 깔끔하지는 않겠지만 지금 형이 졸작할때는 코드 정리 + 효율성 면에서 타협할만한 대안이라고 생각해.</p>
    <p>SQL같은 건 내가 알려주는 것보다 짤때마다 모르는 거 검색하는 게 나을꺼야. 워낙 방대하고 딱 정리해서 말하기는 어려워.</p>
    <p>서버에 붙여둔 morgan 이라는 모듈은 로거인데, pm2 log 0으로 확인하면서 할 때 편리할거야.</p>
    <p>루트 라우터(app.get('/', ...))의 image 태그를 확인하면 static으로 지정된 폴더가 어떻게 동작하는지 확인할 수 있어.</p>
    <p>라우팅 도중 갑자기 이상한 페이지가 뜬다면, public 폴더안에 같은 이름의 html이 있을 수도 있어. .html만 안붙이면 문제는 없겠지만</p>
    <br><br>
    <p style='font-size: 2em; color:magenta; background-color:orange'>잘모르는 거 있거나 급한 질문은 카톡으로 보내줘</p>
    <p style='font-size: 2em; color:cyan; background-color:black'>Sincerely, Oh the God Juyoung</p>
    <image src='https://s3-eu-west-1.amazonaws.com/userlike-cdn-blog/troll-chat-tips/troll.jpg'/>
    </div></body>
    </html>`);
});

app.listen(port);
console.log(`server listens ${port}`);

/*
아래나와 있는 거는 비밀번호같은 것을 포함할 수 있어서 웹에 띄우지 않았어 주석 보고 익힐것.

node js 문법
`` : engraved quoto로 이안에서 ${변수}이름으로 변수 참조 가능

*/

/*
기본 명령어:

#0. 공통
명령어 사용법
  프로그램이름 명령어 대상 옵션, 형태로 사용

프로그램 이름이란?
  리눅스에 등록된 기본 프로그램이랑 따로 설치한 프로그램들(nodejs, mysql 등)
  이외에 패키지 관리도구를 이용해 받은 프로그램같은 경우는 따로 환경변수에 등록
  하여 사용가능

환경변수 란?
  시스템 변수, 일반적인 변수라고 생각하면 됨.
  규칙 : .bashrc에 등록하여 사용 / 등록하였지만 참조가 안되는 경우에는 source ~/.bashrc로 환경변수 업데이트 필요

왜 환경변수 사용?
  1. 보안을 위해
  2. $PATH 등 리눅스 기본 변수등이 있음. $PATH는 쉘이 명령어를 실행할때 참조하는 디렉토리 목록으로 윈도우에서
  이클립스 깔때 그 PATH와 동일함. 'echo $PATH'로 확인가능

옵션이란?
  프로그램마다 추가 옵션을 제공함
  예 : rm foo bar -rf
  -r : recursively, 디렉토리 삭제에 이용
  -f : force, 오류띄우지 않는 강제삭제
  -rf : 옵션을 다수 사용할때는 여러개 '-'이후에 여러개 이어서 사용가능

permission denied 오류?
  사용자 디렉토리 밖의 문서에 쓰기를 하거나 apt-get등 시스템 와이드한 프로그램 이용시 뜨는 오류.
  앞에 sudo를 붙여서 사용하여 해결가능.

#1. apt-get
리눅스 패키지 관리 도구 : 윈도우 프로그램 설치/제거 같은 기능
사용법 : sudo apt-get (명령어) (대상) -(옵션)
  명령어 종류 : install / remove
  대상 : 의존성 있는 모든 레파지토리, 구글 검색을 통해 패키지 이름 검색
  자주 사용하는 옵션 : -y(확인여부를 묻지 않고 설치)

#2. ls / cd / df / vi
2.1 ls : list directory, 디렉토리 검색
자주사용하는 옵션 :
-a(all, 숨김파일 포함하여 검색, 콤마로 시작하는 디렉토리는 기본적으로 숨김파일로 간주)
-l(list, 리스트 형태로 출력)
-h(human, 용량을 사람에게 익숙한 형태로 출력)

cf.

ubuntu@ip-172-31-9-83:~$ ls -alh
total 72K
drwxr-xr-x 10 ubuntu ubuntu 4.0K Nov  7 10:35 .
drwxr-xr-x  3 root   root   4.0K Sep 29 10:56 ..
-rw-------  1 ubuntu ubuntu 4.0K Nov  4 09:09 .bash_history
-rw-r--r--  1 ubuntu ubuntu  220 Aug 31  2015 .bash_logout
-rw-r--r--  1 ubuntu ubuntu 3.7K Aug 31  2015 .bashrc
drwx------  2 ubuntu ubuntu 4.0K Sep 29 11:08 .cache
.
.
.

이런형식으로 출력되는데,  맨 앞의 'drwxr-xr-x' 같은 경우 파일 퍼미션을 나타냄.
(파일 종류)오너/그룹/아더 형태로 나타나는데 d의 경우 directory를 나타내고 일반 파일의 경우 -로 나타남.
오너 / 그룹 / 아더 는 파일 소유자의 권한, 그룹 소속의 권한, 그외 사용자들의 권한을 나타냄.
r : 읽기 , w : 쓰기, x : 실행

중간의 ubuntu ubuntu같은 경우 앞이 오너, 뒤가 소속 그룹을 나타냄


2.2 cd : change directory
자주 사용하는 옵션 :
- (없음)
cf. 디렉토리 축약어
  ~ : 홈 디렉토리, 윈도우의 juyoung, seonwu등등 사용자 권한의 디렉토리
  . : 현재 디렉토리
  .. : 이전 디렉토리
  / : 루트 디렉토리, '~' 보다 상위의 디렉토리는 대부분 sudo 권한으로 사용해야함


2.3 df : disk free, 파일시스템의 사용 용량 출력
자주 사용하는 옵션  :
-h(human, 용량을 사람에게 익숙한 형태로 출력)

2.4 vi : 리눅스 기본 텍스트 에디터
자주 사용하는 옵션 :
- (없음)
주의사항 :
~ 보다 상위 디렉토리에서는 sudo 커맨드를 사용하여 사용할것

#3. mysql
비밀번호 : 한글 자판으로, '선우'
접속 방법 :
  1. xshell 상에서는 mysql -uroot -p라고 입력이후에 비밀번호 입력
  2. mysql workbench를 받아 ssh를 통한 연결 선택 후 호스트에 형 서버 IP 입력, public key를 통한 로그인 선택후 nsw_key 파일 선택
사용 방법 :
  쿼리는 인터넷을 참고하는 것이 빠름
이외 :
  db 인코딩은 utf-8로 설정해놨음. 변경하고 싶을 때는 /etc/mysql/mysql.conf.d/mysqld.conf 인가를 vi로 열어서 편집하면 됨
*/
