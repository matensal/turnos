
# Definición de clases
- [Definición de clases](#definición-de-clases)
  - [Behavior](#behavior)
    - [ZBP_SRAP_I_MUELLES](#zbp_srap_i_muelles) 


## [Behavior](#behavior)
### [ZBP_SRAP_I_MUELLES](#zbp_srap_i_muelles)
<pre>
CLASS lhc_ZSRAP_I_MUELLES DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR zsrap_i_muelles RESULT result.

    METHODS validaMuelle FOR VALIDATE ON SAVE
      IMPORTING keys FOR zsrap_i_muelles~validaMuelle.

    METHODS setIdMuelle FOR DETERMINE ON MODIFY
      IMPORTING keys FOR zsrap_i_muelles~setIdMuelle.
    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR zsrap_i_muelles RESULT result.
    METHODS popupfecha FOR MODIFY
      IMPORTING keys FOR ACTION zsrap_i_muelles~popupfecha RESULT result.
    METHODS borrar FOR MODIFY
      IMPORTING keys FOR ACTION zsrap_i_muelles~borrar.


ENDCLASS.

CLASS lhc_ZSRAP_I_MUELLES IMPLEMENTATION.

  METHOD get_instance_authorizations .
  ENDMETHOD.

  METHOD validaMuelle.
    READ ENTITY zsrap_i_muelles
    ALL FIELDS WITH CORRESPONDING #( keys )
    RESULT DATA(lt_result)
    FAILED DATA(failed1)
    REPORTED DATA(reported1).

    "Validamos que no exista el Muelle
    SELECT  Codigo FROM zsrap_i_muelles
    INTO TABLE @DATA(lt_codigo)
    FOR ALL ENTRIES IN @lt_result
    WHERE Codigo = @lt_result-Codigo.
    IF sy-subrc = 0.
      LOOP AT lt_result INTO DATA(muelle).
        APPEND VALUE #( %tky = muelle-%tky
                        %fail-cause = if_abap_behv=>cause-conflict
                        ) TO failed-zsrap_i_muelles.
        APPEND VALUE #( %tky                 = muelle-%tky
                        %msg                 = new_message_with_text(
                        severity = if_abap_behv_message=>severity-error
                        text = 'El código del muelle ya existe'
                        )
                        %element-Codigo     = if_abap_behv=>mk-on  "Marca el campo con el Status Error y habilita un enlace para ir al campo con el error
*                          %state_area          = 'state_area'
                        )
                        TO reported-zsrap_i_muelles.

      ENDLOOP.
    ENDIF.
  ENDMETHOD.

  METHOD setIdMuelle.
    IF keys[ 1 ]-%is_draft = '01'.
      READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
           ENTITY zsrap_i_muelles
            ALL FIELDS WITH CORRESPONDING #( keys )
           RESULT DATA(lt_res).
      IF lt_res IS NOT INITIAL.
        "Actualiza la entidad seleccionada con el keys
        MODIFY ENTITIES OF zsrap_i_muelles IN LOCAL MODE
            ENTITY zsrap_i_muelles
              UPDATE SET FIELDS
              WITH VALUE #( FOR key IN keys ( %tky   = key-%tky
                                              %is_draft = key-%is_draft
                                              Codigo = 'PR'
                                              Nombre = 'MUELLE' ) )
              FAILED DATA(ls_failed)
              REPORTED DATA(ls_reported).

        "Mensaje que se muestra
        APPEND VALUE #( %msg = new_message_with_text(
                         severity = if_abap_behv_message=>severity-information
                         text = 'Determinación Muelle realizada!' )
                      ) TO reported-zsrap_i_muelles.
      ELSE.
        APPEND VALUE #( %msg = new_message_with_text(
                         severity = if_abap_behv_message=>severity-success
                         text = 'No existen datos a modificar' )
                      ) TO reported-zsrap_i_muelles.
      ENDIF.
    ENDIF.
  ENDMETHOD.

  METHOD get_instance_features.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
           ENTITY zsrap_i_muelles
             FIELDS ( Muelleid )
             WITH CORRESPONDING #( keys )
         RESULT DATA(lt_result)
         FAILED failed.

    result = VALUE #(
      FOR ls_res IN lt_result (
        %key                                = ls_res-%key

*        %features-%action-popupFecha = COND #( WHEN ls_res-%is_draft = if_abap_behv=>mk-on
*                                             THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )
        %action-popupFecha = COND #( WHEN ls_res-%is_draft = if_abap_behv=>mk-on
                                             THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )
      ) ).
  ENDMETHOD.

  METHOD popupFecha.
    "Respondemos con la entidad.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
             ENTITY zsrap_i_muelles
               ALL FIELDS WITH CORRESPONDING #( keys )
               RESULT DATA(result1)
               FAILED DATA(failed1)
               REPORTED DATA(reported1).

    "Recupera los datos de la asociación del padre seleccionado.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
           ENTITY zsrap_i_muelles BY \_Turnos
           ALL FIELDS WITH CORRESPONDING #( keys )
             RESULT DATA(result2)
             FAILED DATA(failed2)
             REPORTED DATA(reported2).

    "Si esta marcado el flag de borrar. Borramos las entidades que están comprendidas entre las fechas
    IF keys[ 1 ]-%param-borrar = abap_true .
      MODIFY ENTITIES OF zsrap_i_muelles IN LOCAL MODE
      ENTITY zsrap_i_turnos
      DELETE FROM VALUE #( FOR res2 IN result2 WHERE ( ( Anyo >= keys[ 1 ]-%param-fecha_ini(4) AND Anyo <= keys[ 1 ]-%param-fecha_fin(4) )
                                                                               AND ( Dia >= keys[ 1 ]-%param-fecha_ini AND Dia <= keys[ 1 ]-%param-fecha_fin )
                                                                               AND %is_draft = if_abap_behv=>mk-off
                                                                               AND Muelle = keys[ 1 ]-Muelleid )
                                                                            ( TurnoId = res2-Turnoid  ) )
             FAILED DATA(failed3)
             REPORTED DATA(reported3)
             MAPPED DATA(mapped3).

      mapped = CORRESPONDING #( DEEP mapped3 ).
      reported = CORRESPONDING #( DEEP reported3 ).
      failed = CORRESPONDING #( DEEP  failed3 ).
      IF failed3-zsrap_i_turnos IS NOT INITIAL.
        result = VALUE #( FOR res IN result1 ( %tky = res-%tky
                                                        %param = res ) ).
        RETURN.
      ENDIF.

    ENDIF.

    "Creamos los Turnos
    TYPES: BEGIN OF ty_s_turnos,
             muelle TYPE sysuuid_x16,
             anyo   TYPE gjahr,
             dia    TYPE datum,
             hora   TYPE      uzeit,
           END OF ty_s_turnos.
    DATA: lt_turnos TYPE TABLE OF ty_s_turnos,
          fecha     TYPE datum,
          hora      TYPE uzeit.

    DATA(fecha_ini) = keys[ 1 ]-%param-fecha_ini.
    DATA(fecha_fin) = keys[ 1 ]-%param-fecha_fin.
    DATA(intervalo) = keys[ 1 ]-%param-intervalo.
    IF fecha_ini <= fecha_fin AND intervalo > 0.
      IF fecha_ini < sy-datum.
        fecha = sy-datum.
      ELSE.
        fecha = fecha_ini.
      ENDIF.
      hora = '000000'.
      DATA(dias) = fecha_fin - fecha + 1.
      DATA(turnos_dia) = trunc( ( 24 * 60 ) / intervalo ).
      DO dias TIMES.
        DO turnos_dia TIMES.
          IF fecha = sy-datum AND hora < sy-uzeit. "Solo añadimos las horas que sean mayores a la hora actual cuando el día sea hoy
            hora = hora + ( intervalo * 60 ). "El intervalo es en minutos
            CONTINUE.
          ENDIF.
          APPEND INITIAL LINE TO lt_turnos ASSIGNING FIELD-SYMBOL(<ls_turno>).
          <ls_turno>-muelle = keys[ 1 ]-Muelleid.
          <ls_turno>-anyo = fecha(4).
          <ls_turno>-dia = fecha.
          <ls_turno>-hora = hora.
          hora = hora + ( intervalo * 60 ). "El intervalo es en minutos
        ENDDO.
        ADD 1 TO fecha.
      ENDDO.
    ENDIF.

    MODIFY ENTITIES OF zsrap_i_muelles IN LOCAL MODE
    ENTITY zsrap_i_muelles
    CREATE BY \_Turnos
    AUTO FILL CID FIELDS ( Muelle Anyo Dia Hora ) WITH VALUE #( ( %tky = keys[ 1 ]-%tky
                                 %target =  VALUE #( FOR turno IN lt_turnos (
                                          %is_draft = keys[ 1 ]-%is_draft
                                          Muelle = turno-muelle
                                          Anyo = turno-anyo
                                          Dia = turno-dia
                                          Hora = turno-hora
                                          %control = VALUE #(  Muelle = if_abap_behv=>mk-on
                                                              Anyo = if_abap_behv=>mk-on
                                                              Dia = if_abap_behv=>mk-on
                                                              Hora = if_abap_behv=>mk-on )
                                                            )

                                      ) )
                               )

    FAILED DATA(create_failed_2)
    MAPPED DATA(create_mapped_2)
    REPORTED DATA(create_reported_2).

    mapped = CORRESPONDING #( DEEP create_mapped_2 ).
    reported = CORRESPONDING #( DEEP create_reported_2 ).
    failed = CORRESPONDING #( DEEP  create_failed_2 ).

    IF create_failed_2-zsrap_i_turnos IS INITIAL.
      reported-zsrap_i_turnos = VALUE #( FOR turno IN lt_turnos ( %tky                 = keys[ 1 ]-%tky
                            %msg                 = new_message(
                                                    id = '00'
                                                    number = '398'
                                                    v1 = 'Creado turno'
                                                    v2 = turno-anyo && '/'
                                                    v3 = turno-dia && '/'
                                                    v4 = turno-hora
                                                    severity = if_abap_behv_message=>severity-success
                                                    )
                            ) ).

      "Recupera los datos de la asociación del padre seleccionado.
      READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
             ENTITY zsrap_i_muelles BY \_Turnos
             ALL FIELDS WITH CORRESPONDING #( keys )
               RESULT result2
               FAILED failed2
               REPORTED reported2.

      mapped-zsrap_i_turnos = CORRESPONDING #( DEEP result2 ).
    ENDIF.
    "Respondemos con la entidad.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
             ENTITY zsrap_i_muelles
               ALL FIELDS WITH CORRESPONDING #( keys )
               RESULT result1.

    result = VALUE #( FOR res IN result1 ( %tky = res-%tky
                                                       %param = res ) ).

  ENDMETHOD.

  METHOD borrar.
  ENDMETHOD.

ENDCLASS.

CLASS lhc_ZSRAP_I_TURNOS DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

    METHODS validaFecha FOR VALIDATE ON SAVE
      IMPORTING keys FOR zsrap_i_turnos~validaFecha.
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR zsrap_i_turnos RESULT result.

    METHODS popupPedido FOR MODIFY
      IMPORTING keys FOR ACTION zsrap_i_turnos~popupPedido RESULT result.

    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR zsrap_i_turnos RESULT result.
    METHODS popupcrea FOR MODIFY
      IMPORTING keys FOR ACTION zsrap_i_turnos~popupcrea RESULT result.

ENDCLASS.

CLASS lhc_ZSRAP_I_TURNOS IMPLEMENTATION.
  METHOD get_instance_features.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
       ENTITY zsrap_i_turnos
         FIELDS ( Turnoid )
         WITH CORRESPONDING #( keys )
     RESULT DATA(lt_result)
     FAILED failed.

    result = VALUE #(
      FOR ls_res IN lt_result (
        %key                                = ls_res-%key
*        %features-%action-popupPedido = COND #( WHEN ls_res-%is_draft = if_abap_behv=>mk-off
*                                             THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )
        %action-popupPedido = COND #( WHEN ls_res-%is_draft = if_abap_behv=>mk-off
                                             THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )
      ) ).
  ENDMETHOD.

  METHOD validaFecha.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
        ENTITY zsrap_i_turnos
        ALL FIELDS WITH CORRESPONDING #( keys )
        RESULT DATA(result)
        FAILED DATA(failed1)
        REPORTED DATA(reported1).

    LOOP AT result INTO DATA(turno).
      IF turno-Anyo < sy-datum(4).
        APPEND VALUE #( %tky = turno-%tky ) TO failed-zsrap_i_turnos.
        APPEND VALUE #( %tky                 = turno-%tky
                        %msg                 = new_message_with_text(
                                                severity = if_abap_behv_message=>severity-error
                                                text = 'Ejercicio anterior a la fecha actual'
                                               )
                        %element-Anyo =  if_abap_behv=>mk-on )
                        TO reported-zsrap_i_turnos.
      ELSEIF turno-Anyo = sy-datum(4).
        IF turno-Dia < sy-datum.
          APPEND VALUE #( %tky = turno-%tky ) TO failed-zsrap_i_turnos.
          APPEND VALUE #( %tky                 = turno-%tky
                          %msg                 = new_message_with_text(
                                                  severity = if_abap_behv_message=>severity-error
                                                  text = 'Dia menor a la fecha actual'
                                                  )
                          %element-Dia =  if_abap_behv=>mk-on )
                          TO reported-zsrap_i_turnos.
        ELSE.
          IF turno-Dia = sy-datum AND turno-Hora < sy-uzeit.
            APPEND VALUE #( %tky = turno-%tky ) TO failed-zsrap_i_turnos.
            APPEND VALUE #( %tky                 = turno-%tky
                        %msg                 = new_message_with_text(
                                                severity = if_abap_behv_message=>severity-error
                                                text = 'Hora menor a hora actual en el día actual'
                                                )
                        %element-Hora =  if_abap_behv=>mk-on )
                        TO reported-zsrap_i_turnos.
          ENDIF.
        ENDIF.
      ENDIF.
    ENDLOOP.

  ENDMETHOD.

  METHOD get_instance_authorizations.
  ENDMETHOD.

  METHOD popupPedido.

    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
         ENTITY zsrap_i_turnos
         ALL FIELDS WITH CORRESPONDING #( keys )
         RESULT DATA(result1).
    IF result1 IS NOT INITIAL AND keys[ 1 ]-%is_draft = if_abap_behv=>mk-off.
      APPEND VALUE #(  %cid                = keys[ 1 ]-%cid_ref
                         %IS_draft = keys[ 1 ]-%is_draft
                         Turnoid = keys[ 1 ]-Turnoid
                              %state_area = 'NO DRAF' )
                              TO reported-zsrap_i_turnos.
      APPEND VALUE #( %cid                = keys[ 1 ]-%cid_ref
                    %IS_draft = keys[ 1 ]-%is_draft
                    Turnoid = keys[ 1 ]-Turnoid ) TO failed-zsrap_i_turnos.
      APPEND VALUE #( %cid                = keys[ 1 ]-%cid_ref
                      %IS_draft = keys[ 1 ]-%is_draft
                      Turnoid = keys[ 1 ]-Turnoid
                          %state_area          = 'NO DRAF'
                          %msg                 = new_message_with_text(
                          severity = if_abap_behv_message=>severity-information
                          text = 'Activa el modo edición'
                          )
                          )
                          TO reported-zsrap_i_turnos.

    ELSEIF result1 IS NOT INITIAL AND keys[ 1 ]-%is_draft = if_abap_behv=>mk-on.
      "Actualiza la entidad seleccionada con el keys
      MODIFY ENTITIES OF zsrap_i_muelles IN LOCAL MODE
          ENTITY zsrap_i_turnos
            UPDATE SET FIELDS
            WITH VALUE #( FOR key IN keys ( %cid_ref                = key-%cid_ref
                         %IS_draft = key-%is_draft
                         Turnoid = key-Turnoid
                                            Vbeln = key-%param-Vbeln
                                           ) )
            FAILED DATA(ls_failed)
            REPORTED DATA(ls_reported).

      "Refrescamos la entidad en el navegador el Update no lo refresca si no refrescamos la página
      result = VALUE #( FOR res IN result1 ( %tky = res-%tky
                                                    %param = res ) ).
*    result = VALUE #( FOR res IN keys ( %tky = res-%tky
*                                                    %param = res-%param ) ).
    ENDIF.


  ENDMETHOD.

  METHOD popupCrea.
    READ ENTITIES OF zsrap_i_muelles IN LOCAL MODE
           ENTITY zsrap_i_turnos
           ALL FIELDS WITH CORRESPONDING #( keys )
           RESULT DATA(result1).

    MODIFY ENTITY zsrap_i_turnos
    CREATE
    AUTO FILL CID FIELDS ( Anyo Dia Hora )
    WITH VALUE #( ( %is_draft = keys[ 1 ]-%is_draft
                                              Anyo = '2023'
                                              Dia = '20230201'
                                              Hora = '133300'
                                              %control = VALUE #(
                                                                  Anyo = if_abap_behv=>mk-on
                                                                  Dia = if_abap_behv=>mk-on
                                                                  Hora = if_abap_behv=>mk-on )
                                                                ) )
        FAILED DATA(create_failed_2)
        MAPPED DATA(create_mapped_2)
        REPORTED DATA(create_reported_2).

    "Refrescamos la entidad en el navegador el Update no lo refresca si no refrescamos la página
    result = VALUE #( FOR res IN result1 ( %tky = res-%tky
                                                  %param = res ) ).
  ENDMETHOD.

ENDCLASS.
</pre>
