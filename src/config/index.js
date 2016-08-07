'use strict';

module.exports = {
    db: {
        mongodb: {
            host: 'mongodb://localhost:27017/definityDashboard'
        },
        redis: {
            host: '127.0.0.1',
            port: 6379
        },
        models: {
            adsenseAd: 'adsensead',
            revcontentBoost: 'revContentBoost',
            revcontentWidget: 'revContentWidget',
            discrepancy: 'discrepancy'
        },
        timeFrame: {
            prefix: {
                startDate: 'dataFrom:',
                endDate: 'dataTo:'
            },
            freshness: 4, // in hours
            updatePeriod: 3, // in days
            period: 7 // delete data after 6 months
        }
    },
    appServer: {
        host: 'localhost',
        port: 3001
    },
    revContent: {
        name: 'Revcontent',
        clientKey: 'Definitimedia',
        clientSecret: '94bf416d6b7ebbd3c7ecff73d52af6e0e06e5f02',
        prefix: 'revcnt:',
        batchSize: 100 // max allowed batch size
    },
    google: {
        clientKey: '385739320356-doa2kvaia84dbn9spiogo1sh7b7iatvu.apps.googleusercontent.com',
        clientSecret: '7NBgLT2oybgWl8JbfUO4VN9g',
        redirectUrl: 'http://http://www.lazypeacock.com/',
        prefix: 'google:'
    },
    googleService: {
        name: 'Google Analytics',
        type: 'service_account',
        projectID: 'definitimedia-1371',
        privateKeyID: '4954e23c51e8395366d2b35701b2bcc7b1c43e3f',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIJQgIBADANBgkqhkiG9w0BAQEFAASCCSwwggkoAgEAAoICAQCLT9qGeS+w4s9v\n9f8SxvM39ANqDsKkcHW+PqPuhGNQkdc+fWcheky8Quc7Juc4BzS/RAQrIjUwMtZD\n1dUHvZBTrQ9A0DZuOfAQtsLNvnokKVD8DeNtpn21k5Yjo56YUVyfjo23Lr3EZDs/\n31sy9DFtcMWm056SzZKmM1Bbmkm7XdAfCAM66HlS5mrII9c8+ZRNJlRlZJJf9D9H\nt0QtSSw4WDVuum7cpO25C0HDoxQb3bo3eoIaikj5uk6zfxEgt3YY3AXtuoNjIOtF\nbzx4v8zCUHCxYnQ8ts4MhdOHeemf+qo+/wAPWSDy3WJ1Baw/ZuWg8brGE+BTj1Cj\nZPZVUSooGn5NjeaPQNGurFJ3KL7OZs1s3sJFt1qr1AtqA2PKoDCjmNCrvBqwNbtu\n4EsIceOIldPILl7+KI6PKZnyuADI2HmW/L49DFNEsVVwzG1EChpHh6f0uYeHyLH1\njhOhoSN1fwpQyfDM++R7VgzBMob7GXKPny8nKVv15Rqm8pUvGdsI/6JKFIoCZ6YE\nBRqsCw/zksSGML9Dx631uFj2ip6082cN8uuYcB5MTTYLbvsdY1RLfdhtszH+6up2\ne7SAhKqmOqMgWjkyJejNXHTow1HYP2g2PUsDpcmDLtziIKJECo/tXi6TgLiBAgWX\nd54ok4d2ASNLvBDDlTV94WC9RPCxIwIDAQABAoICAEHsnueFz4iwPCOqUHNtTElN\nIpR8uaUhRsapU+AaK/lDmo0KwNP50PhB3LSEO2SrHE3qfOKAhJTzaaueM/o+vV6r\nhY1ROoC80BrIsbS1D42vM5Cjbd1ErTZQyfrBgdponiEvT2bBKrIWEGewZbLeFcnJ\nVO8WM3Ma7uvRWpSOlZeh1Evq+cRVoJwXR67ALym+nWxI2CVHC3F23r8sPYoEl3Vu\nYJKujKnDLm+joRJYSLrLGUUJpymyCMiMXpPYbJ2D09H9xJxz55rwSAWKlx44/Udy\n03FNut3EUAtjBO+WRHUdJJU9DKU2sz3af64K6jDym3WnDpCPdVd1eV5o95z2FLFC\n3N4DB5T5ecIel37la7gfsQThDsLS2MReAczPEGeGui7fatg2HzkgS3+wBbF394uV\nX43r9HaHdItTEB2PjrNyaw0Kaka/z/lwNIwSBdD47ddI8V4AeL0KpI+K8n/Ltqps\n/0E9wc00lIEX2wWDeay+f85qAgcdkqE7v9nwbppqE8P4KjNlNaGiN4Hbx+FmGMfz\n2OYjJf2GW7EaGVm6GZw/6r2MVLpxShup5mQFLp7havgrP1QlvYQ0vmBx6PqlNXN7\nffQponbbAaqxACHcTBTpex33KLtlGgXvlPNCqkIt0re9zzVAYlQvw4Yb45Y0knh3\nd8iqtlu4Lp4kfEhT42+BAoIBAQDbhzyxKYjZM+ua1vv4+XpUr5lsrZQhQjY1qZHS\nu/14QhIegROW+GQoDfdmXzRN47H9dCGG7o/KoWTUoYEWRanDG77jzZV0oxfARDu3\nBLMFuSYT/qDLxrTpa5Xy8Yhtp08j0ro4KbygsxWs8rEnNwFmFsLZquifuRDXxYcD\nJOyVG1WKwqHj8jYWa4gXm4ACA3dZUmWzKIB+y8xY0UwXBoQ3IvdY8NNEF1MNv/1e\ntDr8qhafjlXPHnp32aynnGRYbD8d+ZnrCXlGKl0A158VFRK+2JzLWTEbe7hlhpy4\nYLk+xtbuc4dssAOvbmSC50hdt12JAA8+tWpesBHLbdDBBz7jAoIBAQCidO7e409R\nMu8rdFp7iORXYTQdWa2rKifSJ1h79eB2YLdaat7e6q8L7kP2lltBOHXV3onO6vNA\nC04C9RZdAlvNp5yaR2BL+rASo4jQSQzpnHzddI5/GBqJFWfXAwFmvgMcqHwBi2h+\n557DTylXJ3XB8rxrs+4bq6vFL8RZID/OMETFaZQaXPPM4ZkQaFrUtHD1viblULE0\nSVLnX0kmm/nx/KyDQrgc8QiE0vpH5CAz8yfmBzP49pGlfPah0fU1pRvt9D2KlAlL\nchYYtlmVbK3yeWYqTBLcioEiSAIrHj8syUO7vUzY5HQX3IwJQzhE3RrBnjhy9s3J\nzAmj90JUJxjBAoIBAFDYOfKocBxFMaQBPiQPhAyB6oeKWP3yi1Ix02D/GDZcZp3T\nPSqg6QmTMyQBNZrlmpvTU7GEU3H1A9QGciqIlx8iLadpA3xDv7BvsGoTEfaum6ZL\nZF4HHILFuyAP8QUo001HAotCW5P2v6nEapcde6dkBHfyp96CYgCEXtc6luHGgjcq\nvEHc5ixVh3XiLz8OlbpQTOGwrbmERgoDcfkczj4b42lerv7pdA2hQabJyttXrCMw\nYMt41vMiN6I2RwIFQy0/yX40K/Q6D6wKvCwgaZnc3clJXHtZkavZ6gdAn5fN1ENW\nSm4tV/4YMm2+zPiuWYTlf7fBSZ37S2JWW8VqbK8CggEAeJQ4FAE9hvQ6JtO2sQhb\nCywfpUVBrNCeO9JuT5ug3dxNWvQFtgkUodNYaHcTBmakt3f0aztiDwAVCAbncWNl\nxlAI4U3nAJ3x//OXgZkm12IKH8j6VwUJ9QOJTkJx0NNpteSsHe1eQwshgK+J7KFi\nOvEyvvIO4kTaOoKIxuoz0ZNsB+akQakKX+B2XoJGIKhJS2y2q+/nhvqBaTAFOH3+\n14iGduqXgwu4GfYKRD/jUwvAanCgN8KzOdR1rogK66VABK8K2oekGnZ0RiVaepju\nxxEqLmzGdyDqVgqCaYSKuXAtMPSBTF7MeEV/PwTAiARgbqNEHLho58XkxempNpLK\nQQKCAQEAn6BL1lzjcyKkwvrQqJXe39sFQMR0ycsOYZ5la+qgiLQ0ff7tyC/Ubdgy\nh7P3fy/St0Vd+3+CxIup/55Qek3N97Cctto7g5qykdp9y3xR85bvE/RqV4x+d1uy\nDHS/PqWy4Bcx68UU/FubPLcuHQ1JEx+BlCWo1b491uYqzhRgJ6ZAnH7JMdb6YiDJ\nbgXeJpW04yN+HCS1YBDgmnplxvHGxYiiLzGYllRZ2ecg2xoi9h3xhY9+9eIe52oZ\nYIvIpxSC2uMXqVUp+H03WfEWWLhGDwEt2WTIE5DdR1qQ47F2nEteMZeJ/JUhJJqV\nYxnX0mMJF/iWRNVBLwyR7EGxJexxdg==\n-----END PRIVATE KEY-----\n',
        clientEmail: 'definitimedia-1371@appspot.gserviceaccount.com',
        clientID: '111600612432640397623',
        authURI: 'https://accounts.google.com/o/oauth2/auth',
        tokenURI: 'https://accounts.google.com/o/oauth2/token',
        authProviderURL: 'https://www.googleapis.com/oauth2/v1/certs',
        clientURL: 'https://www.googleapis.com/robot/v1/metadata/x509/definitimedia-1371%40appspot.gserviceaccount.com'
    },
    contentAd: {
        name: 'ContentAd',
        clientKey: '5e4dceb1-0ac2-4c22-934b-0a18c88f66aa',
        clientSecret: 'NstpPPAe3&y@',
        prefix: 'cntad:'
    },
    discrepancy: {
        name: 'Discrepancy'
    },
    accessToken: {
        expiryPeriod: 300000
    },
    seed: {
        todos: true
    },
    csv: {
        dirName: 'csvFiles'
    }
};
