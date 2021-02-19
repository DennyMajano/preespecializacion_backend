const momenttz = require("moment-timezone");
const moment = require("moment");
module.exports = {
  getHora: async () => {
    return now.format("HH:mm:ss");
  },
  horario_laboral: (hora_inicio, hora_final) => {
    const actual = momenttz().tz("America/El_Salvador");
    const hora_inicio_ = moment(hora_inicio, "HH:mm:ss");
    const hora_final_ = moment(hora_final, "HH:mm:ss");
    const inicio = momenttz.tz(hora_inicio_, "America/El_Salvador");
    const final = momenttz.tz(hora_final_, "America/El_Salvador");

    console.log("inicio", inicio);
    console.log("final", final);
    console.log("actual", actual);
    return actual.isAfter(inicio) && actual.isBefore(final);
  },
  validar_permiso_actual: (dia_permiso) => {
    const now = momenttz().tz("America/El_Salvador");
    const dia_actual = moment(now, "YYYY-MM-DD");
    const permiso = moment(dia_permiso, "YYYY-MM-DD");
    return dia_actual.isSame(permiso, "day");
  },

  validar_permiso_vencido: (dia_permiso) => {
    const now = momenttz().tz("America/El_Salvador");
    const dia_actual = moment(now, "YYYY-MM-DD");
    const permiso = moment(dia_permiso, "YYYY-MM-DD");
    return dia_actual.isAfter(permiso, "day");
  },

  validar_dia_laborar: () => {
    const now = momenttz().tz("America/El_Salvador");
    const date = moment(now);
    const dow = date.day();
    console.log("DIA DE HOY", dow);

    return dow >= 1 && dow < 7;
  },

  evaluar_vencimiento: (fecha) => {
    const now = momenttz().tz("America/El_Salvador");
    const dia_actual = moment(now, "YYYY-MM-DD HH:mm");
    const vencimiento = moment(fecha, "YYYY-MM-DD HH:mm");
    console.log(dia_actual, vencimiento);
    return dia_actual.isSameOrBefore(vencimiento, "minutes");
  },
  show_hora() {
    const now = momenttz().tz("America/El_Salvador");
    console.log(now);
  },
  /**
   *
   * @param {*} minutos
   * @description minutos expresado en enteros
   */
  vencimiento_minutos(minutos) {
    const hoy = momenttz().tz("America/El_Salvador");
    const vencimiento = hoy.add(parseInt(minutos), `minutes`);

    return vencimiento.format("YYYY-MM-DD HH:mm:ss");
  },

  getDateTime(){
    return  momenttz().tz("America/El_Salvador").format("YYYY-MM-DD HH:mm:ss");
  }
};
