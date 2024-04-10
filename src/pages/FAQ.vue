<script setup lang="ts">
import router from '@/router';

const showOrHideCard = (index: number) => {
    let disc = document.getElementsByClassName('item__disc')[index]
    let arrow = document.getElementsByClassName('item__arrow')[index]
    disc.classList.toggle('item__disc-closed');
    arrow.classList.toggle('item__arrow-closed');
};
const toGame = () => {
    router.push('/')
}
</script>

<template>
    <div class="faq">
        <div class="faq__header">
            <div class="faq__header-section">
                <router-link to="/" class="faq__nav">← К игре</router-link>
                <h1 class="faq__title">FAQ</h1>
                <span class="faq__mock">← К игре</span>
            </div>
            <span class="faq__line"></span>
        </div>
        <div class="faq__list">
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(0)">
                    <span class="item__title">Участие в акции бесплатное?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Да, участие бесплатное. В сутки дается одно бесплатное вращение колеса. Для получения дополнительных вращений необходимо выполнять задания, в том числе связанные с финансовыми операциями.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(1)">
                    <span class="item__title">Кто может участвовать в акции?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">
                    <p>Физические лица, достигшие 18 лет, дееспособные. Участие в акции лиц, не достигших 18 лет и недееспособных, не допускается.</p>
                    <p style="margin-top:12px;">Подробнее о правилах и сроках проведения акции можно ознакомиться в разделе «акции» на сайте BetBoom.</p>
                </div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(2)">
                    <span class="item__title">Как проходит игра?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">
                    <p>Нажимая на кнопку, персонаж на экране совершает различные действия (ход):</p>
                    <img style="margin-top:16px;" src="@/assets/faq/attackRoulette.png" alt=""/>
                    <p style="margin-top:16px;"><span style="font-weight:700;">Фарм</span> - после вращения колеса ты получаешь определенное количество XP, необходимого для продвижения по игре.</p>
                    <p style="margin-top:16px;"><span style="font-weight:700;">Атака</span> - после вращения колеса твой персонаж наносит определенное количество урона сопернику.</p>
                    <p style="margin-top:16px;"><span style="font-weight:700;">Получить</span> - после вращения колеса ты получаешь один из бонусов.</p>
                    <p style="margin-top:16px;"><span style="font-weight:700;">Идти</span> - персонаж перемещается к следующему уровню.</p>
                </div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(3)">
                    <span class="item__title">Какие есть виды заданий? В чём разница?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">
                    <p>Задания делятся на 3 типа:</p>
                    <p style="margin-top:16px;"><span style="font-weight:700;">Игровые </span> - разовые задания, связанные с выполнением определенных действий в игре DOTA 2.</p>
                    <p style="margin-top:16px;"><span style="font-weight:700;">Социальные </span> - для выполнения этих заданий необходимо смотреть трансляции в Twitch. Также можно выполнять специальные задания от организаторов и партнеров, которые будут появляться во время проекта.</p>
                    <p style="margin-top:16px;"><span style="font-weight:700;">BetBoom </span> - набор заданий, связанных с активностями по ставкам в твоём личном кабинете BetBoom.</p>
                </div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(4)">
                    <span class="item__title">Как получить ходы</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">
                    <p style="margin-top:16px;"> Каждому игроку доступен один ход в сутки. Для получения большего количества действий необходимо выполнять задания:</p>
                    <ul style="margin-top:8px;list-style-type: disc;">
                        <li style="margin-left:16px;">Совершать ставки на платформе или в приложении BetBoom.</li>
                        <li style="margin-left:16px;">Выполнять игровые и социальные задания.</li>
                    </ul>
                </div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(5)">
                    <span class="item__title">Что такое XP</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Это очки опыта, которые ты зарабатываешь, выполняя разные задания в рамках акции, а также вращая колесо во время действия «Фарм». С их помощью ты продвигаешься по игре и получаешь крутые призы</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(6)">
                    <span class="item__title">Что такое HP</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Это суммарное количество очков, которое нужно набрать вращая колесо, чтобы пройти дальше во время сражения.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(7)">
                    <span class="item__title">Регистрации на BetBoom обязательная?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Начать играть можно и без регистрации на BetBoom, но чтобы забрать свои призы, а также быстрее проходить уровни, регистрация потребуется. Также без регистрации невозможно принять участие в финальном розыгрыше и забирать фрибеты на ставки.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(8)">
                    <span class="item__title">Зачем мне привязывать мои игровые аккаунты?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Для автоматизации сбора статистики и обновления статуса выполненных заданий на платформе нужно обязательно привязать игровой аккаунт Steam</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(9)">
                    <span class="item__title">Зачем мне привязывать мои социальные аккаунты?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Для выполнения социальных заданий нужно обязательно привязать свои социальные аккаунты.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(10)">
                    <span class="item__title">Как долго происходит начисление XP?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Начисление может происходить в течение 24 часов после выполненного задания.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(11)">
                    <span class="item__title">Зачем мне выполнять задания BetBoom?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Каждое выполненное задание дает дополнительные Ходы для прохождения игры, а также увеличивает прирост XP.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(12)">
                    <span class="item__title">Как происходит розыгрыш суперприза?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">
                    <p style="margin-top: 16px;">Розыгрыш пройдёт на специальной трансляции, организованной BetBoom по завершению акции (после 30.10.2022).</p>
                    <p style="margin-top: 16px;">Для участия вам понадобятся купоны, которые вы получаете при достижении нового уровня. Чем больше купонов, тем выше шанс получить приз:</p>
                    <div style="display:flex;flex-flow: column;gap:8px;margin-top: 16px;">
                        <div style="display:flex;flex-flow:row;gap: 16px;">
                            <img style="width:80px;height:80px;" src="@/assets/img/discription/disc1.png" alt=""/>
                            <div>
                                <p style="font-weight:700;">Выдается при достижении 2-4 уровней.</p>
                                <p>Разыгрывается 100 фрибетов на 5000 рублей и 100 сертификатов Fragstore.ru на 1000 рублей каждый.</p>
                            </div>
                        </div>
                        <div style="display:flex;flex-flow:row;gap: 16px;">
                            <img style="width:80px;height:80px;" src="@/assets/img/discription/disc2.png" alt=""/>
                            <div>
                                <p style="font-weight:700;">Выдаётся при достижении 5-8 уровней: </p>
                                <p>Разыгрывается 100 фрибетов на 10 000 рублей и 100 сертификатов Fragstore.ru номиналом 3000 рублей</p>
                            </div>
                        </div>
                        <div style="display:flex;flex-flow:row;gap: 16px;">
                            <img style="width:80px;height:80px;" src="@/assets/img/discription/disc3.png" alt=""/>
                            <div>
                                <p style="font-weight:700;">Выдаётся при достижении 9-15 уровней: </p>
                                <p>Разыгрывается 50 фрибетов на 20 000 рублей и 50 Сертификатов на 5000 рублей в магазине Fragstore.ru</p>
                            </div>
                        </div>
                        <div style="display:flex;flex-flow:row;gap: 16px;">
                            <img style="width:80px;height:80px;" src="@/assets/img/discription/disc4.png" alt=""/>
                            <div>
                                <p style="font-weight:700;">Выдаётся при достижении 16-24 уровней:  </p>
                                <p>Разыгрывается 10 фирбетов на 50 000 рублей и 20 сертификатов на 10 000 рублей в магазине Fragstore.ru</p>
                            </div>
                        </div>
                        <div style="display:flex;flex-flow:row;gap: 16px;">
                            <img style="width:80px;height:80px;" src="@/assets/img/discription/disc5.png" alt=""/>
                            <div>
                                <p style="font-weight:700;">Выдаётся при достижении 25 уровня (прохождение игры):</p>
                                <p>Разыгрывается Мечта Профессионального Игрока: полностью оснастим твоего игровое место для киберспорта: компьютер, монитор, наушники, мышь, клава и игровое кресло, стол.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(13)">
                    <span class="item__title">Как получить гарантированный приз на уровне?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">При достижении определенного уровня ты можешь получить один из призов: фрибет на ставки в твоём аккаунте BetBoom, а также скидки от партнеров акции</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(14)">
                    <span class="item__title">Могу ли я несколько раз пройти игру?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Да. Каждый раз достигнув последнего уровня ты можешь снова переместиться на первый и начать заново. Пройдя игру несколько раз, ты получишь несколько лотерейных билетов на розыгрыш суперприза.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(15)">
                    <span class="item__title">Куда обращаться если что-то не работает?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Обращаться необходимо в поддержку BetBoom. Нужно описать проблему и указать, что она связана с игрой.</div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(16)">
                    <span class="item__title">На каких устройствах работает игра?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Игра работает на всех мобильных устройствах (смартфонах выше Apple iPhone 5 SE или Google Android уровня Samsung Series A), соединенных с сетью интернет, а также на персональных компьютерах и ноутбуках в популярных браузерах не старше 3-х последних обновлений. </div>
            </div>
            <div class="item">
                <span class="item__line"></span>
                <div class="item__header" v-on:click="showOrHideCard(17)">
                    <span class="item__title">Для игры интернет нужен всегда?</span>
                    <img class="item__arrow" src="@/assets/svg/arrowWhite.svg" alt=""/>
                </div>
                <div class="item__disc">Да. Без интернета игра не работает.</div>
            </div>
            <router-link to="/" class="faq__goback btn btn-green">Вернуться к игре</router-link>
        </div>     
    </div>
</template>

<style lang="scss" scoped>
.faq {
    &__header {
        background: url('@/assets/img/texture.png'), linear-gradient(180deg, #2C292E 0%, #2C292E 93.23%, #191A1E 100%);
    }
    &__header-section {
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        padding: 20px 16px;
        @media (min-width: 930px) {
            max-width: 912px;
            margin: 0 auto;
        }
    }
    &__nav {
        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        background: linear-gradient(180deg, #35E03B 0%, #288F18 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        cursor: pointer;
        transition: all .3s;

        &:hover {
            opacity: .8;
        }
    }
    &__mock {
        visibility: hidden;
    }
    &__line {
        display: block;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        width: 100%;
        height: 1px;
    }
    &__list {
        display: flex;
        flex-flow: column;
        margin-top: 23px;
        padding: 0 16px 150px;
        gap: 26px;
        @media (min-width: 930px) {
            max-width: 912px;
            margin: 23px auto;
        }
    }
    &__goback {
        width: 20rem;
        max-width: 288px;
        margin: 40px auto 0;
    }
}
.item {
    &__line {
        display: block;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        width: 100%;
        height: 1px;
    }
    &__header {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        margin-top: 26px;
        cursor: pointer;
    }
    &__title {
        font-weight: 700;
    }
    &__arrow {
        transition-duration: .5s;
        transform: rotate(180deg);
        &-closed {
            transform: rotate(0deg);
        }

    }
    &__disc {
        display: block;
        margin-top: 16px;
        overflow: hidden;
        max-height: 0px;
        transition-duration: .5s;
        font-weight: 500;
        &-closed {
            max-height: fit-content;
        }
    }
}

</style>
