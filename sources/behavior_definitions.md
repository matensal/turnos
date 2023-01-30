# Behavior definitions
- [Behavior definitions](#behavior-definitions)
  - [ZSRAP_I_MUELLES](#ZSRAP_I_MUELLES)
    - [Acciones](#acciones)
    - [Determinaciones](#determinaciones)
      - [onModifyCreate](#onmodifycreate)
    - [Validaciones](#validaciones)
      - [validateHoras](#validatehoras)
      - [validateFecha](#validatefecha)
  - [ZSRAP_C_MUELLES](#ZSRAP_C_MUELLES) Proyección
  
## [ZSRAP_I_MUELLES](#ZSRAP_I_MUELLES)
Behavior managed implementado en la clase [ZBP_SRAP_I_MUELLES](definicion_clases.md/#ZBP_SRAP_I_MUELLES).

<pre>
managed implementation in class zbp_srap_i_muelles unique;
//strict;
with draft;


define behavior for ZSRAP_I_MUELLES //alias <alias_name>
persistent table zrap_pv_muelles
draft table zrap_d_muelles
lock master total etag Codigo
authorization master ( instance )
//etag master <field_name>
{
  create;
  update;
  delete;
  field ( numbering : managed ) Muelleid;
  field ( mandatory ) Codigo;

  action ( features : instance ) popupFecha parameter ZSRAP_CREA_TURNOS result [1] $self; //Para actualiar
  static factory action  borrar  [1]; //Para añadir

  determination setIdMuelle on modify { create; } //Cuando se modifica la entidad
  validation validaMuelle on save { field Codigo; create; }

  association _Turnos { create; with draft; }

  mapping for zrap_pv_muelles
  {
    Muelleid = muelleid;
    Codigo = codigo;
    Nombre = nombre;

  }
}

define behavior for ZSRAP_I_TURNOS //alias <alias_name>
persistent table zrap_pv_turnos
draft table zrap_d_turnos
lock dependent by _Muelles
authorization dependent by _Muelles
//etag master <field_name>
{
  update;
  delete;
  field ( readonly ) Muelle, Nombre, Vbeln;
  field ( numbering : managed ) Turnoid;

  action ( features : instance ) popupPedido parameter ZSRAP_ASIGNA_PEDIDO result [1] $self;
  action ( features : instance ) popupCrea parameter zsrap_crea_turnos result [1] $self;
  validation validaFecha on save { field Anyo, Dia, Hora; create; }
  association _Muelles { with draft; }

  mapping for zrap_pv_turnos
  {
    Anyo = anyo;
    Dia = dia;
    Hora = hora;
    Muelle = muelle;
    Turnoid = turnoid;
    Vbeln = vbeln;
  }

}
</pre>

### [Acciones](#acciones)
Las acciones `update` y `delete` dependen de la instancia seleccionada. Al añadir `( features : instance )` nos permite determinar si la acción estará habilitada o no. Esta determinación se define en la clase [ZBP_SRAP_I_RAPPORTS](definicion_clases.md/#zbp_srap_i_rapports) en el metodo `GET_FEATURES`. En este caso hemos implementado que si el rapport es del mes anterior, no se pueda modificar ni eliminar. 
### [Determinaciones](#determinaciones)
#### [onModifyCreate](#onModifyCreate)
Definimos la determinación on `onModifyCreate` implementada en la clase [ZBP_SRAP_I_RAPPORTS](definicion_clases.md/#zbp_srap_i_rapports) en el método `onmodifycreate`. Se ejecutara cuando entremos a crear el objeto y nos servirá para añadir un valor por defecto en el campo `Fecha`.
<pre>
determination onModifyCreate on modify { create; }
</pre>

### [Validaciones](#validaciones)
#### [validateHoras](#validateHoras)
Implementada en la clase [ZBP_SRAP_I_RAPPORTS](definicion_clases.md/#zbp_srap_i_rapports) en el método `validateHoras`. Validación que se ejecuta al crear y actualizar sobre los campos `HoraInicio` y `HoraFin`. Valida que la hora de inicio no sea superior a la hora de fin.
<pre>
validation validateHoras on save { field HoraInicio, HoraFin; create; update; }
</pre>
#### [validateFecha](#validateFecha)
Implementada en la clase [ZBP_SRAP_I_RAPPORTS](definicion_clases.md/#zbp_srap_i_rapports) en el método `validateFecha`. Validación que se ejecuta al crear y actualizar sobre el campo `Fecha`. Valida que la fecha no esté vacía.
<pre>
validation validateFecha on save { field Fecha; create; update; }
</pre>

## [ZSRAP_C_RAPPORTS](#zsrap_c_rapports)
Proyección del behavior [ZSRAP_I_MUELLES](#ZSRAP_I_MUELLES)
<pre>
projection;
use draft;
//strict;

define behavior for ZSRAP_C_MUELLES //alias <alias_name>
{
  use create;
  use update;
  use delete;

  use action popupFecha as fecha;
  use action borrar as borrarTurno;

  use association _Turnos { create; }
}

define behavior for ZSRAP_C_TURNOS //alias <alias_name>
{
  use update;
  use delete;

  use action popupPedido as pedido;
  use action popupCrea;

  use association _Muelles;
}
</pre>