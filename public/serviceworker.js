var CACHENAME = "static-cache-v-13";
var DYNAMICCACHE = "dynamic-cache-v-3";
var filelist  = [
    '/index.html',
    '/images/test.png',
    '/offline.html'
]

self.addEventListener('install', function(e){
    console.log('Install');
    e.waitUntil(
        caches.open(CACHENAME).then(function(cache){
            return cache.addAll(filelist)
        })
    )
})

// self.addEventListener('fetch', function(e){
//     console.log('fetch');
//     var request = e.request;
//     e.respondWith(
//         caches.match(request)
//         .then(function(response){
//             if(response){
//                 return response;
//             }else{
//                 return fetch(request)
//                 .then(function(response){
//                     return response;
//                 })
//             }
//         })
//         .catch(function(err){
//             return caches.match('/offline.html')
//         })
//     )
// })

self.addEventListener('fetch', function(e){
    console.log('fetch');
    var request = e.request;
    e.respondWith(
        fetch(e.request)
        .then(function(res){
            return caches.open(DYNAMICCACHE)
                    .then(function(cache){
                       cache.put(e.request.url, res.clone());
                       return res;
                    })        

        })
        .catch(function(err){
            console.log('Network Error');
            return  caches.open(CACHENAME)
                    .then(function(cache){
                        console.log('cache file', cache);
                        return caches.match(e.request)
                               
                    })
                    .catch(function(err){
                        console.log('Offline');
                        return caches.match('/offline.html');    
                    })
            
        })
    )
})