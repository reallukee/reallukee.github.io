(function() {
    function generateRandomString(length)
    {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++)
        {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    async function generateCodeChallenge(codeVerifier)
    {
        function base64encode(string)
        {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);

        return base64encode(digest);
    }

    function login()
    {
        let codeVerifier = generateRandomString(128);

        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'user-read-private \
                user-read-email \
                user-top-read \
                playlist-modify-public \
                playlist-modify-private';
    
            localStorage.setItem('dostyCodeVerifier', codeVerifier);
    
            let args = new URLSearchParams({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirectUri,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge
            });
    
            window.location = 'https://accounts.spotify.com/authorize?' + args;
        });
    }

    function logout()
    {
        localStorage.removeItem('dostyRefreshToken');
        localStorage.removeItem('dostyAccessToken');
        localStorage.removeItem('dostyCodeVerifier');

        window.location.reload();
    }

    function requestToken(code)
    {
        codeVerifier = localStorage.getItem('dostyCodeVerifier');

        let body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier
        });

        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })
        .then(response => {
            if (!response.ok) throw new Error('HTTP status ' + response.status);
            return response.json();
        })
        .then(data => {
            access_token = data.access_token;
            refresh_token = data.refresh_token;

            // localStorage.setItem('dostyAccessToken', access_token);
            // localStorage.setItem('dostyRefreshToken', refresh_token);

            getUserData();

            window.history.replaceState({}, document.title, '/');
        })
        .catch(error => { catchError(error); });

        localStorage.removeItem('dostyCodeVerifier');
    }

    function refreshToken() {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: new URLSearchParams({
                client_id,
                grant_type: 'refresh_token',
                refresh_token,
            }),
        })
        .then(response => {
            if (!response.ok) throw new Error('HTTP status ' + response.status);
            return response.json();
        })
        .then(data => {
            access_token = data.access_token;
            refresh_token = data.refresh_token;

            // localStorage.setItem('dostyAccessToken', access_token);
            // localStorage.setItem('dostyRefreshToken', refresh_token);

            getUserData();
        })
        .catch(error => { catchError(error); });
    }



    const localHost = 'http://127.0.0.1:3000';

    const clientId = 'eb517c9244c848b3bc580709a52ce58d';
    const redirectUri = 'https://reallukee.github.io/';

    let access_token = localStorage.getItem('dostyAccessToken') || null;
    let refresh_token = localStorage.getItem('dostyRefreshToken') || null

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    var type = localStorage.getItem('dostyType') || 'tracks';
    var timeRange = localStorage.getItem('dostyTimeRange') || 'short_term';
    var limit = localStorage.getItem('dostyLimit') || 10;

    document.getElementById('type').dataset.value = type;
    document.getElementById('timeRange').dataset.value = timeRange;
    document.getElementById('limit').dataset.value = limit;

    change('type');
    change('timeRange');
    change('limit');

    validateType();
    validateTimeRange();
    validateLimit();

    document.getElementById('content').innerHTML = generateDefault();

    if (code)
    {
        requestToken(code);

        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('loginContent').style.display = 'block';
        document.getElementById('logoutContent').style.display = 'none';
        document.getElementById('status').innerText = 'Accesso Eseguito come Utente!';
    }
    else
    {
        if (access_token && refresh_token)
        {
            document.getElementById('login').style.display = 'none';
            document.getElementById('logout').style.display = 'block';
            document.getElementById('loginContent').style.display = 'block';
            document.getElementById('logoutContent').style.display = 'none';
            document.getElementById('status').innerText = 'Accesso Eseguito come Utente!';

            getUserData();
        }
        else
        {
            document.getElementById('login').style.display = 'block';
            document.getElementById('logout').style.display = 'none';
            document.getElementById('loginContent').style.display = 'none'; 
            document.getElementById('logoutContent').style.display = 'block';
            document.getElementById('status').innerText = "L'Accesso non è Stato Eseguito!";
        }
    }

    document.getElementById('download').style.display = 'none';
    document.getElementById('save').style.display = 'none';
    document.getElementById('open').style.display = 'none';



    function validateType()
    {
        switch (type)
        {
            case 'tracks':
            case 'artists':
            case 'moods':
            case 'genres':
            case 'albums':
                break;

            default:
                type = 'tracks';
                document.getElementById('type').dataset.value = type;
                change(type);
                break;
        }
    }

    function validateTimeRange()
    {
        switch (timeRange)
        {
            case 'short_term':
            case 'medium_term':
            case 'long_term':
                break;
            
            default:
                timeRange = 'short_term';
                document.getElementById('timeRange').dataset.value = timeRange;
                change(timeRange);
                break;
        }
    }

    function validateLimit()
    {
        switch (limit)
        {
            case '10':
            case '15':
            case '25':
            case '40':
            case '50':
                break;
            
            default:
                limit = '10';
                document.getElementById('limit').dataset.value = limit;
                change(limit);
                break;
        }      
    }


    
    function catchError(error)
    {
        if (error.status == 401) refreshToken();
        else document.getElementById('content').innerHTML = `:( Error!<br />${error.code}<br />${error.message}`;
    }



    async function getUserData() {
        var url = 'https://api.spotify.com/v1/me';

        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => {
            localStorage.setItem('dostyUserName', data.display_name);
            localStorage.setItem('dostyUserId', data.id);

            document.getElementById('status').innerHTML = `Accesso Eseguito come <a href="${data.uri}" target="_blank">${localStorage.getItem('dostyUserName')}</a>!`;
        })
        .catch((error) => { catchError(error); });
    }



    function generateDefault()
    {
        return `<div class="row"> \
            <div class="col col-100"> \
            DOSTy v6.22<br /> \
            Copyright (C) 1994 Reallukee<br /> \
            <br /> \
            Last Login ${new Date().toLocaleString()}<br /> \
            Logged as ${localStorage.getItem('dostyUserName')}.<br /> \
            <br /> \
            D:\\Music> \
            </div> \
            </div>`;
    }

    function generateHeader(directory)
    {
        return `<div class="row"> \
            <div class="col col-100"> \
            DOSTy v6.22<br /> \
            Copyright (C) 1994 Reallukee<br /> \
            <br /> \
            Last Login ${new Date().toLocaleString()}<br /> \
            Logged as ${localStorage.getItem('dostyUserName')}.<br /> \
            <br /> \
            D:\\Music\\${directory}>dir /F:%filters%<br /> \
            <br /> \
            DOSTy Explorer v6.22<br /> \
            <br /> \
            * Disk Serial Number: B4D8-A2C6<br /> \
            * Disk Format Type: FAT16<br /> \
            * Total Disk Size: 1048676KB<br /> \
            * Available Disk Size: 131072KB<br /> \
            <br /> \
            Current Directory: D:\\Music\\${directory}<br /> \
            Current Filters: ${type}, ${timeRange}, ${limit}<br /> \
            <br /> \
            </div> \
            </div> \
            <div class="row"> \
            <div class="col col-auto"> \
            ###<br />--- \
            </div> \
            <div class="col col-100"> \
            File Name<br />--------- \
            </div> \
            <div class="col col-auto"> \
            Size<br />---- \
            </div> \
            </div>`;
    }

    function generateFooter(directory, special, size)
    {
        return `<div class="row"> \
            <div class="col col-100"> \
            <br /> \
            * Directory Elements: ${size}<br /> \
            * Directory Size: ${parseInt(special)}KB<br /> \
            <br /> \
            D:\\Music\\${directory}> \
            </div> \
            </div>`;
    }

    function generateContent(index, name, url, size)
    {
        if (url == null)
        {
            return `<div class="row"> \
                <div class="col"> \
                ${index}. \
                </div> \
                <div class="col col-100"> \
                ${name} \
                </div> \
                <div class="col"> \
                ${size} \
                </div> \
                </div>`;
        }
        else
        {
            return `<div class="row"> \
                <div class="col"> \
                ${index}. \
                </div> \
                <div class="col col-100"> \
                <a href="${url}" target="_blank">${name}</a> \
                </div> \
                <div class="col"> \
                ${size} \
                </div> \
                </div>`;
        }
    }



    function getTopTracks(timeRange, limit)
    {
        fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => { showTopTracks(data); })
        .catch((error) => { catchError(error); });
    }

    function showTopTracks(data)
    {
        var content = document.getElementById('content');

        content.innerHTML = generateHeader('TopTracks');

        var special = 0;

        while (data.items.length % 5 != 0) data.items.pop();

        for (var i = 0; i < data.items.length; i++)
        {
            var index = (i + 1);

            if (index < 10) index = "0" + index;

            content.innerHTML += generateContent(index, `${data.items[i].name}.mp3`, data.items[i].external_urls.spotify, `${parseInt(data.items[i].duration_ms / 1024)}KB`);

            special += parseInt(data.items[i].duration_ms / 1024);
        }

        content.innerHTML += generateFooter('TopTracks', special, limit);
    }



    function getTopArtists(timeRange, limit)
    {
        fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => { showTopArtists(data); })
        .catch((error) => { catchError(error); });
    }

    function showTopArtists(data)
    {
        var content = document.getElementById('content');

        content.innerHTML = generateHeader('TopArtists');

        var special = 0;

        while (data.items.length % 5 != 0) data.items.pop();

        for (var i = 0; i < data.items.length; i++)
        {
            var index = (i + 1);

            if (index < 10) index = "0" + index;

            content.innerHTML += generateContent(index, `${data.items[i].name}.artist`, data.items[i].external_urls.spotify, `${data.items[i].popularity}KB`);

            special += data.items[i].popularity;
        }

        content.innerHTML += generateFooter('TopArtists', special, limit);
    }



    function getMoods(timeRange, limit)
    {
        var url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`;

        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => { showMoods(data); })
        .catch((error) => { catchError(error); });
    }

    function showMoods(data)
    {
        var content = document.getElementById('content');

        content.innerHTML = generateHeader('Moods');

        var special = 0;

        for (var i = 0; i < data.items.length; i++) special += data.items[i].id + ',';

        special = special.substring(0, special.length - 1);

        fetch(`https://api.spotify.com/v1/audio-features?ids=${special}`, {
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => {
            var acousticness = 0.0;
            var danceability = 0.0;
            var duration = 0;
            var energy = 0.0;
            var instrumentalness = 0.0;
            var liveness = 0.0;
            var loudness = 0.0;
            var speechiness = 0.0;
            var tempo = 0;
            var valence = 0.0;

            for (var i = 0; i < data.audio_features.length; i++)
            {
                if (data.audio_features[i] != null)
                {
                    acousticness += data.audio_features[i].acousticness * 100;
                    danceability += data.audio_features[i].danceability * 100;
                    duration += data.audio_features[i].duration_ms;
                    energy += data.audio_features[i].energy * 100;
                    instrumentalness += data.audio_features[i].instrumentalness * 100;
                    liveness += data.audio_features[i].liveness * 100;
                    loudness += data.audio_features[i].loudness;
                    speechiness += data.audio_features[i].speechiness * 100;
                    tempo += data.audio_features[i].tempo;
                    valence += data.audio_features[i].valence * 100;
                }
            }

            var moods = [
                { name: 'Acousticness', size: acousticness / limit },
                { name: 'Danceability', size: danceability / limit },
                { name: 'Duration', size: duration / 60000 },
                { name: 'Energy', size: energy / limit },
                { name: 'Instrumentalness', size: instrumentalness / limit },
                { name: 'Liveness', size: liveness / limit },
                { name: 'Loudness', size: loudness / limit },
                { name: 'Speechiness', size: speechiness / limit },
                { name: 'Tempo', size: tempo / limit },
                { name: 'Valence', size: valence / limit },
            ];

            for (var i = 0; i < moods.length; i++)
            {
                var index = (i + 1);

                if (index < 10) index = "0" + index;

                var symbol;

                switch (moods[i].name)
                {
                    case 'Acousticness':
                    case 'Danceability':
                    case 'Energy':
                    case 'Instrumentalness':
                    case 'Liveness':
                    case 'Speechiness':
                    case 'Valence':
                        symbol = '%';
                        break;
                    
                    case 'Duration':
                        symbol = 'M';
                        break;

                    case 'Loudness':
                        symbol = 'DB';
                        break;

                    case 'Tempo':
                        symbol = 'BPM';
                        break;

                    default:
                        break;
                }
    
                content.innerHTML += generateContent(index, `${moods[i].name}.mood`, null, `${moods[i].size.toFixed(1)}${symbol}`);
            }

            content.innerHTML += generateFooter('Moods', 1024, 10);
        })
        .catch((error) => { catchError(error); });
    }



    function getTopGenres(timeRange)
    {
        fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => { showTopGenres(data); })
        .catch((error) => { catchError(error); });
    }

    function showTopGenres(data)
    {
        var content = document.getElementById('content');

        content.innerHTML = generateHeader('TopGenres');

        var genres = [];

        for (var i = 0; i < data.items.length; i++)
        {
            if (data.items[i] != null)
            {
                for (var j = 0; j < data.items[i].genres.length; j++)
                {
                    if (genres[data.items[i].genres[j]] == null) genres[data.items[i].genres[j]] = 1;
                    else genres[data.items[i].genres[j]]++;
                }
            }
        }

        genres = Object.keys(genres).map(function(key) { return [key, genres[key]]; });       
        genres.sort(function(first, second) { return second[1] - first[1]; });

        var special = 0;

        while (genres.length % 5 != 0) genres.pop();

        for (var i = 0; i < limit && i < genres.length; i++)
        {
            if (genres[i] != null)
            {
                var index = (i + 1);

                if (index < 10) index = "0" + index;

                content.innerHTML += generateContent(index, `${genres[i][0].toUpperCase()}.genre`, null, `${parseInt(genres[i][1])}KB`);

                special += parseInt(genres[i][1]);
            }
        }

        content.innerHTML += generateFooter('TopGenres', special, genres.length);
    }



    function getTopAlbums(timeRange)
    {
        fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(async (response) => {
            if (response.ok) return response.json();
            else throw await response.json();
        })
        .then((data) => { showTopAlbums(data); })
        .catch((error) => { catchError(error); });
    }

    function showTopAlbums(data)
    {
        var content = document.getElementById('content');

        content.innerHTML = generateHeader('TopAlbums');

        var albums = [];

        for (var i = 0; i < data.items.length; i++)
        {
            if (data.items[i].album.name != null)
            {
                if (albums[data.items[i].album.name] == null) albums[data.items[i].album.name] = { count: 1, url: data.items[i].album.external_urls.spotify };
                else albums[data.items[i].album.name].count++;
            }
        }

        albums = Object.keys(albums).map(function(key) { return [key, albums[key]]; });         
        albums.sort(function(first, second) { return second[1].count - first[1].count; });

        var special = 0;

        while (albums.length % 5 != 0) albums.pop();

        for (var i = 0; i < limit && i < albums.length; i++)
        {
            if (albums[i] != null)
            {
                var index = (i + 1);

                if (index < 10)  index = "0" + index;

                content.innerHTML += generateContent(index, `${albums[i][0].toUpperCase()}.album`, albums[i][1].url, `${parseInt(albums[i][1].count)}KB`);
    
                special += parseInt(albums[i][1].count);
            }
        }

        content.innerHTML += generateFooter('TopAlbums', special, 10);
    }



    document.getElementById('login').addEventListener('click', () => login(), false);
    document.getElementById('logout').addEventListener('click', () => logout(), false);



    document.getElementById('get').addEventListener('click', () => get(), false );
    document.getElementById('download').addEventListener('click', () => download(), false);
    document.getElementById('save').addEventListener('click', () => save(), false);
    document.getElementById('open').addEventListener('click', () => open(), false);



    function changeType(typeValue)
    {
        document.getElementById('type').dataset.value = typeValue;
        localStorage.setItem('dostyType', document.getElementById('type').dataset.value);
        type = document.getElementById('type').dataset.value;

        change('type');
    }

    document.getElementById('tracks').addEventListener('click', () => changeType('tracks'), false);
    document.getElementById('artists').addEventListener('click', () => changeType('artists'), false);
    document.getElementById('moods').addEventListener('click', () => changeType('moods'), false);
    document.getElementById('genres').addEventListener('click', () => changeType('genres'), false);
    document.getElementById('albums').addEventListener('click', () => changeType('albums'), false);



    function changeTimeRange(timeRangeValue)
    {
        document.getElementById('timeRange').dataset.value = timeRangeValue;
        localStorage.setItem('dostyTimeRange', document.getElementById('timeRange').dataset.value);
        timeRange = document.getElementById('timeRange').dataset.value;

        change('timeRange');
    }

    document.getElementById('short_term').addEventListener('click', () => changeTimeRange('short_term'), false);
    document.getElementById('medium_term').addEventListener('click', () => changeTimeRange('medium_term'), false);
    document.getElementById('long_term').addEventListener('click', () => changeTimeRange('long_term'), false);



    function changeLimit(limitValue)
    {
        document.getElementById('limit').dataset.value = limitValue;
        localStorage.setItem('dostyLimit', document.getElementById('limit').dataset.value);
        limit = document.getElementById('limit').dataset.value;

        change('limit');
    }

    document.getElementById('10').addEventListener( 'click', () => changeLimit(10), false );
    document.getElementById('15').addEventListener( 'click', () => changeLimit(15), false );
    document.getElementById('25').addEventListener( 'click', () => changeLimit(25), false );
    document.getElementById('40').addEventListener( 'click', () => changeLimit(40), false );
    document.getElementById('50').addEventListener( 'click', () => changeLimit(50), false );



    function change(id)
    {
        var parent = document.getElementById(id);

        parent.childNodes.forEach(element => { if (element.nodeType == Node.ELEMENT_NODE) element.dataset.checked = 'false'; });

        document.getElementById(parent.dataset.value).dataset.checked = 'true';
    }



    function get()
    {
        document.getElementById('download').style.display = 'block';

        if (type == 'tracks') document.getElementById('save').style.display = 'block';
        else document.getElementById('save').style.display = 'none';

        document.getElementById('open').style.display = 'none';

        switch (type)
        {
            case 'tracks': getTopTracks(timeRange, limit); break;
            case 'artists': getTopArtists(timeRange, limit); break;
            case 'moods': getMoods(timeRange, limit); break;
            case 'genres': getTopGenres(timeRange); break;
            case 'albums': getTopAlbums(timeRange); break;
            default: break;
        }
    }

    function download()
    {
        var content = document.getElementById('content');

        html2canvas(content, { allowTaint: true }).then(function (canvas) {
            var link = document.createElement('a');

            document.body.appendChild(link);

            var date = new Date();

            let d = String(date.getDate()).padStart(2, '0');
            let m = String(date.getMonth() + 1).padStart(2, '0');
            let y = date.getFullYear();

            link.download = `dosty_${type}_${timeRange}_${limit}_${d}_${m}_${y}.png`;
            link.href = canvas.toDataURL();
            link.target = '_blank';

            link.click();
        
            document.body.removeChild(link);
        });
    }

    function save()
    {
        var date = new Date();

        let d = String(date.getDate()).padStart(2, '0');
        let m = String(date.getMonth() + 1).padStart(2, '0');
        let y = date.getFullYear();

        fetch(`https://api.spotify.com/v1/users/${localStorage.getItem('dostyUserId')}/playlists`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + access_token,
            },
            body: JSON.stringify({
                name: `yourbestsongs`,
                description: `DOTSy - ${d}/${m}/${y}`,
                public: true,
            }),
        })
        .then(response => {
            if (!response.ok) throw new Error('HTTP status ' + response.status);
            return response.json();
        })
        .then(data => {
            var id = data.id;

            document.getElementById('open').dataset.uri = data.uri;

            fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + access_token,
                },
            })
            .then(async (response) => {
                if (response.ok)  return response.json();
                else throw await response.json();
            })
            .then((data) => {
                var tracks = "";

                for (var i = 0; i < data.items.length; i++) tracks += `${data.items[i].uri},`;

                tracks = tracks.substring(0, tracks.length - 1);

                fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?position=0&uris=${tracks}`, {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + access_token,
                    },
                })
                .then(async (response) => {
                    if (response.ok) return response.json();
                    else throw await response.json();
                })
                .then((data) => {
                    document.getElementById('save').style.display = 'none';
                    document.getElementById('open').style.display = 'block';
                })
                .catch((error) => { catchError(error); });
            })
            .catch((error) => { catchError(error); });
        })
        .catch(error => { catchError(error); });
    }

    function open()
    {
        var link = document.createElement('a');

        document.body.appendChild(link);

        link.href = `spotify:platylist:${document.getElementById('open').dataset.uri}`;

        link.click();

        document.body.removeChild(link);
    }
})();
