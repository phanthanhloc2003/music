const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playtbtn = $('.btn-toggle-play')
const progress = $('.progress')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const randombtn = $('.btn-random')
const repeatbtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'năm mới bình an',
            singer: 'sơn tùng',
            path: './musuc/music/nammoibinhan.mp3',
            image: './img/img/hinhanh1.jpeg'
        },
        {
            name: 'making my way',
            singer: 'sơn tùng',
            path: './musuc/music/MAKING MY WAY.mp3',
            image: './img/img/hinhanh2.jpeg'
        },
        {
            name: 'có ai hẹn hò cùng em chưa',
            singer: 'Quân ap',
            path: './musuc/music/coaihenhocungemchua.mp3',
            image: './img/img/hinhanh3.jpeg'
        },
        {
            name: 'anh đã từ bỏ rồi đấy ',
            singer: 'nguyenn x',
            path: './musuc/music/Anh Đã Từ Bỏ Rồi Đấy.mp3',
            image: './img/img/hinhanh4.jpeg'
        },
        {
            name: 'hẹn em ở lần yêu thứ 2',
            singer: 'nguyenn x',
            path: './musuc/music/Hẹn Em Ở Lần Yêu Thứ 2.mp3',
            image: './img/img/hinhanh5.jpeg'
        },
        {
            name: 'anh đã từ bỏ rồi đấy ',
            singer: 'nguyenn x',
            path: './musuc/music/Anh Đã Từ Bỏ Rồi Đấy.mp3',
            image: './img/img/hinhanh6.jpeg'
        }, {
            name: 'anh sẽ về sớm thôi ',
            singer: 'vũ duy khánh',
            path: './musuc/music/y2meta.com - Anh Sẽ Về Sớm Thôi Chẳng Muốn Để Em Chờ Đợi | Anh Sẽ Về Sớm Thôi | Vũ Duy Khánh (slowed) (128 kbps).mp3',
            image: './img/img/hinhanh7.jpeg'
        },
        {
            name: 'ngày em đẹp nhất',
            singer: 'tama X bell',
            path: './musuc/music/y2meta.com - Ngày Em Đẹp Nhất - Tama x Bell「Lofi Ver」_ Vì ngày em đẹp nhất là ngày anh mất em!!! (128 kbps).mp3',
            image: './img/img/hinhanh8.jpeg'
        },
        {
            name: 'thằng điên ',
            singer: 'phương ly',
            path: './musuc/music/thằng điên.mp3',
            image: './img/img/hinhanh9.jpeg'
        },
        {
            name: 'yêu không cần hứa ',
            singer: 'vương anh tú',
            path: './musuc/music/y2meta.com - YÊU KHÔNG CẦN HỨA - VƯƠNG ANH TÚ (128 kbps).mp3',
            image: './img/img/hinhanh10.jpeg'
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {


            return `  <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div> `

        })
        playList.innerHTML = htmls.join('')

    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this

        const cWidth = cd.offsetWidth
        // xử lý cd quay / dừng

        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }],
            {
                duration: 10000, // 10 seconds
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause()
        // xử lý phóng to thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const neCdwidth = cWidth - scrollTop
            cd.style.width = neCdwidth > 0 ? neCdwidth + 'px' : 0
            cd.style.opacity = neCdwidth / cWidth
        };
        // xử lý khi click play 
        playtbtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }

        }
        //khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến đọ bài hát thay dổi
        audio.ontimeupdate = function () {

            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

            }
        }
        // xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }
        // lji next xong
        nextbtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextsong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev song
        prevbtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // xử lý bật tắt radom song
        randombtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            randombtn.classList.toggle('active', _this.isRandom)
        }
        // xử lí phát laị  một song
        repeatbtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            repeatbtn.classList.toggle('active', _this.isRepeat)

        }

        // sử lý next song khi audio  ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextbtn.click()
            }


        }
        //lắng nge hành vi click vào playlist
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            // xử lý khi click vào song
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if (e.target.closest('.option')) {

                }

            }

        }



    },
    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    nextsong: function () {

        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()

    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },


    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            }, 300)
        })

    },

    start: function () {
        // định nghịa các thuộc tính cho oject
        this.defineProperties()

        // lắng nge / xử lý các sự kiện (dom events)
        this.handleEvent()
        // tải thông tin bài hát đầu tiên khi iu chạy
        this.loadCurrentSong()
        //render playlist
        this.render();


    }
}

app.start()