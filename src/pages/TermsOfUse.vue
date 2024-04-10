<script setup lang="ts">
import router from '@/router';
const toGame = () => {
    router.push('/')
}
</script>

<template>
    <div class="use">
        <div class="use__header">
            <div class="use__header-section">
                <router-link to="/" class="use__nav">← К игре</router-link>
                <h1 class="use__title">Правила акции</h1>
                <span class="use__mock">← К игре</span>
            </div>
            <span class="use__line"></span>
        </div>
        <div class="use__main">
            <h1 class="use__name">Правила проведения Акции «DOTA BOOM» / «Бум вокруг Dota2»</h1>
            <p class="use__paragraph">1. ОБЩИЕ ПОЛОЖЕНИЯ</p>
            <p class="use__text">1.1. Настоящее стимулирующее мероприятие (далее – «Акция») носит исключительно рекламный
                характер, не основана на риске, не требует внесения дополнительной платы за участие.
            </p>
            <p class="use__text">1.2. Акция проводится на территории Российской Федерации.</p>
            <p class="use__paragraph">2. СВЕДЕНИЯ ОБ ОРГАНИЗАТОРЕ АКЦИИ</p>
            <p class="use__text">2.1. Лицом, организующим проведение стимулирующего мероприятия согласно настоящим
                Правилам, именуемым Организатор Акции, является Общество с ограниченной ответственностью
                Фирма «СТОМ» (ООО Фирма «СТОМ», далее – «Организатор»).
            </p>
            <p class="use__text">2.2. Место нахождения: 353733, Краснодарский край, М.Р-Н Каневской, С.П. Каневское, Ст-ца
                Каневская, ул. Ленина, д. 136, ком. 5/1
            </p>
            <p class="use__text">2.2.1. Почтовый адрес: 353733, Краснодарский край, М.Р-Н Каневской, С.П. Каневское, Ст-ца
                Каневская, ул. Ленина, д. 136, ком. 5/1
            </p>
            <p class="use__text">2.3. ОГРН 1027739014291; ИНН 7705005321; КПП 236301001.</p>
            <p class="use__text">2.4. С информацией об организаторе Акции, о правилах ее проведения, порядке и размере
                начисления призов, сроках и прочих условиях, можно ознакомиться на сайте в сети Интернет, по
                адресу: betboom.ru/dotaboom в разделе «Акции и бонусы» (далее – «Сайт Акции»).
            </p>
            <p class="use__paragraph">3. СРОКИ ПРОВЕДЕНИЯ АКЦИИ</p>
            <p class="use__text">3.1. Сроки совершения действий для участия в Акции: с «08» октября 2022 г. в 12:00 (время по GMT +3) до «30» октября 2022 г. в 23:59 (время по GMT +3) включительно.</p>
            <p class="use__text">3.2. Срок подведения итогов Акции: до «11» ноября 2022 г.</p>
            <p class="use__text">3.3. Организатор Акции оставляет за собой право в любой момент приостановить/прекратить Акцию, на своё усмотрение.</p>
            <p class="use__paragraph">4. УЧАСТНИКИ АКЦИИ, ИХ ПРАВА И ОБЯЗАННОСТИ</p>
            <p class="use__text">4.1. Лица, соответствующие настоящим Правилам и выполнившие требования, установленные
                настоящими Правилами, именуются Участниками Акции.
            </p>
            <p class="use__text">4.2. Участниками Акции могут являться дееспособные физические лица, достигшие возраста 18
                лет, зарегистрированные, а также прошедшие идентификацию в качестве участников азартной игры в
                букмекерской конторе ООО Фирма «СТОМ» (BetBoom) (далее – «Участники Акции»).
            </p>
            <router-link to="/" class="goback btn btn-green">Вернуться к игре</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.use {
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
    &__main {
        display: flex;
        flex-flow: column;
        margin-top: 23px;
        padding: 67px 16px 150px;
        gap: 26px;

        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        @media (min-width: 930px) {
            max-width: 912px;
            margin: 23px auto;
        }
    }
    &__name {
        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
    }
    &__paragraph {
        font-size: 18px;
    }
    &__text {
        font-size: 16px;
    }

    .goback {
        width: 20rem;
        max-width: 288px;
        margin: 40px auto 0;
    }
}
</style>
