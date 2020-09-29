<template>
    <v-btn class="diagram-item" :class="{active: current.id === item.id}" @click="SET_CURRENT(item)">
        <v-btn  class="feed left" v-if="!isRenaming" text>
            <span>{{item.name || "_"}}</span>
            <span class="rename_button pointer" icon @click.stop="isRenaming = true">🖉</span>
        </v-btn>
        <div v-else>
            <v-layout row align-center>
                <v-text-field v-model="name" label="" required></v-text-field>
                <v-btn icon @click="rename">✓</v-btn>
                <v-btn icon @click="del"><v-icon size="14">close</v-icon></v-btn>
            </v-layout>
        </div>
    </v-btn>
</template>

<script lang='ts'>
	import { mapMutations, mapGetters } from 'vuex'
    import { Vue } from 'vue-property-decorator'
    import { PropType } from 'vue';
    import { Diagram } from '../../types/Diagram';

    export default Vue.extend({
        props: {
            item: {
                type: Object as PropType<Diagram>,
                required: true,
            },
        },
        data() {
            return {
                isRenaming: false,
                name: this.item.name,
            }
        },
        components: {

        },
        computed: {
            ...mapGetters(['current']),

        },
		methods: {
            ...mapMutations(['SET_CURRENT', 'UPD_DIAGRAM', 'DEL_DIAGRAM']),
            del(): void {
                this.DEL_DIAGRAM(this.item.id)
                this.isRenaming = false
                if (this.current.id === this.item.id) {
                    this.SET_CURRENT(this.item)
                }
            },
            rename(): void {
                this.UPD_DIAGRAM({ id: this.item.id, name: this.name })
                this.isRenaming = false
            },
        },
    })

</script>

<style lang="scss" scoped>

</style>
