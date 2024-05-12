<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar ref="calendarComponentRef" class="demo-app-calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ formatTime(arg.event.start) }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRaw, watch, defineProps } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { format, parseISO } from 'date-fns'

const props = defineProps({
  calendarList: {
    type: Array,
    required: true
  }
})

const calendarComponentRef = ref(null)
const currentEvents = ref([])
const initialEvents = ref(props.calendarList)

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  initialView: 'dayGridMonth',
  initialEvents: toRaw(initialEvents.value),
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: false,
  weekends: true,
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  eventsSet: (events) => {
    currentEvents.value = events
  }
}))

watch(initialEvents, (newEvents) => {
  console.log('newEvents :', newEvents)
  const calendarApi = calendarComponentRef.value.getApi()
  if (calendarApi) {
    calendarApi.removeAllEvents()
    newEvents.forEach((event) => calendarApi.addEvent(event))
  }
})

// function handleDateSelect(selectInfo) {
//   let title = prompt('新しいイベントのタイトルを入力してください')
//   let calendarApi = selectInfo.view.calendar
//   calendarApi.unselect()

//   if (title) {
//     calendarApi.addEvent({
//       id: createEventId(),
//       title,
//       start: selectInfo.startStr,
//       end: selectInfo.endStr,
//       allDay: selectInfo.allDay
//     })
//   }
// }

// function handleEventClick(clickInfo) {
//   if (confirm(`${clickInfo.event.title}のイベントを削除してもよろしいですか？`)) {
//     clickInfo.event.remove()
//   }
// }
function formatTime(date) {
  // Date オブジェクトであることを確認
  if (date instanceof Date) {
    return format(date, 'HH:mm')
  }
  // 文字列が ISO 8601 形式である場合、parseISO を使ってパース
  if (typeof date === 'string') {
    return format(parseISO(date), 'HH:mm')
  }
}
</script>

<style lang="css">
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family:
    Arial,
    Helvetica Neue,
    Helvetica,
    sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
</style>
