import Vue from 'vue'
import './Layout.css'

export default Vue.component('DynamicLayout', {
    props: {
      
    },
    data () {
      return {                  
      }
    },
    beforeUpdate () {
        this.prelayout()
    },
    methods: {

        prelayout() {
            if (!this.$refs.container) { return }
            var els = this.$refs.container.querySelectorAll('[target-view]')            
            Array.from(els).filter(it => it.getAttribute('target-view') != '').forEach((e, i) => {                
                var el = this.$refs.container.querySelector('[src-view=' + e.getAttribute('target-view') + ']')
                if (e.children.length > 0)
                    el.appendChild(e.children[0])
            })
        },

        postlayout() {
            this.$emit('layout:begin')
            var els = this.$refs.container.querySelectorAll('[target-view]')
            Array.from(els).filter(it => it.getAttribute('target-view') != '').forEach((e, i) => {
                const srcView = this.$refs.container.querySelector('[src-view=' + e.getAttribute('target-view') + ']')
                if (!srcView || srcView.children.length == 0) return
                e.appendChild(srcView.children[0])
            })
            this.$emit('layout:complete')
        }

    },
    render () {
      // DOM VUE/REACT HACK
      this.$nextTick(() => {
        this.postlayout()
      })
  
      const layoutClass = [
        'layout-container'        
      ]
      return (
        <div class={layoutClass.join(' ')} ref="container">
          <div class="views" ref="views">
            {this.$slots.layout}
          </div>          
          <div style={{display: 'none'}}>
            {this.$slots.default.filter(v => v.tag !== undefined).map((view, i) => {
              return (<div key={view.key || i} src-view={'view-' + (view.key || i)}> {view} </div>)
            })}
          </div>
        </div>
      )
    }
  })
  