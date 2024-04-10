<script setup lang="ts">
    import Modal from '@/components/modal.vue';
    import Item from '@/components/inventoryItem.vue';
    
    </script>
    
    <template>
        <Modal>
            <div class="leave">
                <img class="close" src="@/assets/svg/crossYellow.svg" alt="" />
                <!-- <h1 class="text">Вы уверены что хотите отключить аккаунт DOTA?</h1> -->
                <h1 class="text">Are you sure you want to disable your DOTA account?</h1>
                <div class="buttons">
                    <button class="button base-button button-red">Yes</button>
                    <button class="button base-button button-green" >Cancel</button>
                </div>
            </div>
        </Modal>
    
    </template>
    
    <style lang="scss" scoped>
    .leave {
        display: flex;
        flex-flow: column;
        gap: 24px;
        align-items: center;
        position: relative;
        padding: 24px;
    
        background: url("@/assets/img/texture.png"), linear-gradient(180deg, #2C292E 0%, #191A1E 100%);
        box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    
        border: 2px solid;
        border-image: linear-gradient(180deg, #525257 -21.96%, rgba(47, 52, 56, 0) 55.53%) 20;
    }
    .close {
        position: absolute;
        top: 16px;
        right: 16px;
        cursor: pointer;
    }
    .text {
        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
    }

    .buttons {
        display: flex;
        flex-flow: row;
        gap: 15px;
        width: 100%;
    }
    </style>
    