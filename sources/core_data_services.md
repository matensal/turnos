# Core Data Services (CDS)
- [Core Data Services (CDS)](#core-data-services-cds)
  - [ZBP_SRAP_I_MUELLES](#ZBP_SRAP_I_MUELLES)
    - [ZBP_SRAP_I_MUELLES anotaciones](#ZSRAP_C_MUELLES_ANOTACIONES) 
  - [ZSRAP_I_TURNOS](#ZSRAP_I_TURNOS)
    - [ZSRAP_C_TURNOS anotaciones](#ZSRAP_C_TURNOS_ANOTACIONES) 
  - [ZSRAP_I_CLIENTES](#ZSRAP_I_CLIENTES)
  - [ZSRAP_PV_I_PEDIDOS](#ZSRAP_PV_I_PEDIDOS)

  - [ZSRAP_ASIGNA_PEDIDO](#ZSRAP_ASIGNA_PEDIDO) - CDS Abstracta
    - [ZSRAP_ASIGNA_PEDIDO anotaciones](#ZSRAP_ASIGNA_PEDIDO_ANOTACIONES) 
  - [ZSRAP_CREA_TURNOS](#ZSRAP_CREA_TURNOS) - CDS Abstracta
    - [ZSRAP_CREA_TURNOS anotaciones](#ZSRAP_CREA_TURNOS_ANOTACIONES)



  
## [ZBP_SRAP_I_MUELLES](#core-data-services-cds)
CDS que representa el Business Object (BO) root de la aplicación. Selección principal de los datos de la tabla [zrap_pv_muelles](diccionario_datos.md/#zrap_pv_muelles).
<pre>
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'CDS Interface Muelles'
define root view entity ZSRAP_I_MUELLES as select from zrap_pv_muelles
composition [0..*] of ZSRAP_I_TURNOS as _Turnos 
{
    key muelleid as Muelleid,
    codigo as Codigo,
    nombre as Nombre,
    _Turnos // Make association public
}
</pre>
## [ZSRAP_C_MUELLES_ANOTACIONES](#core-data-services-cds)
Anotaciones para la cds [ZBP_SRAP_I_MUELLES](#ZBP_SRAP_I_MUELLES)

<pre>
@Metadata.layer: #CORE

@UI: {
    headerInfo: {
        typeName: 'Muelle',
        typeNamePlural: 'Muelles',
        title: {
            type: #STANDARD,
            label: 'Muelle',
            value: 'Codigo'
            
        },
        description.value: 'Nombre'
    }
}
@Search.searchable: true
annotate view ZSRAP_C_MUELLES with
{
  @UI.facet: [
       {
          id: 'idMuelles',
          type: #FIELDGROUP_REFERENCE,
          targetQualifier: 'Muelles1',
          label: 'Muelles',
          position: 10
       },

       {
          id: 'idTurnosMuelles',
          type: #LINEITEM_REFERENCE,
          label: 'Turnos',
          position: 20,
          targetElement: '_Turnos'
       }
      ]

  @UI.hidden: true
  Muelleid;

  @UI.lineItem: [{ position: 20 }]
  @UI.identification: [{ position: 20 }]
  @Search.defaultSearchElement: true
  @UI.selectionField: [{ position: 20 }]
  @UI.fieldGroup: [{ qualifier: 'Muelles1', position: 10 }]
  Codigo;

  @UI.lineItem: [{ position: 30 }]
  @UI.identification: [{ position: 30 }, { type: #FOR_ACTION, dataAction: 'fecha', label: 'Crea Intervalo Turnos', invocationGrouping:#ISOLATED }, { type: #FOR_ACTION, dataAction: 'borrar', label: 'Borra Turnos' }]
  @Search.defaultSearchElement: true
  @UI.selectionField: [{ position: 30 }]
  @UI.fieldGroup: [{ qualifier: 'Muelles1', position: 20  }]
  Nombre;
}
</pre>



## [ZSRAP_I_TURNOS](#core-data-services-cds)
Selección de datos de la tabla [zrap_pv_turnos](diccionario_datos.md/#zrap_pv_turnos).

<pre>
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'CDS Interface Turnos'
define view entity ZSRAP_I_TURNOS as select from zrap_pv_turnos
association to parent ZSRAP_I_MUELLES as _Muelles
    on $projection.Muelle = _Muelles.Muelleid {
    key turnoid as Turnoid,
    muelle as Muelle,
    _Muelles.Nombre as Nombre,
    anyo as Anyo,
    dia as Dia,
    hora as Hora,
    vbeln as Vbeln,
    _Muelles  // Make association public
}
</pre>
## [ZSRAP_C_TURNOS_ANOTACIONES](#core-data-services-cds)
Anotaciones para la cds [ZSRAP_I_TURNOS](#ZSRAP_I_TURNOS)

<pre>
@Metadata.layer: #CORE
@UI: {
    headerInfo: {
        typeName: 'Turno',
        typeNamePlural: 'Turnos',
        title: {
            type: #STANDARD,
            label: 'Muelle',
            value: 'Turnoid'
        }
    }
}
@Search.searchable: true
annotate view ZSRAP_C_TURNOS with
{
  @UI.facet: [
    {
        id: 'idTurnos',
        label: 'Turnos',
        type: #FIELDGROUP_REFERENCE,
        targetQualifier: 'Turnos',
        position: 10
    }
    ]

  @UI.hidden: true
  Turnoid;

  @UI.hidden: true
  Muelle;

  @UI.lineItem: [{ position: 10 }]
  @UI.fieldGroup: [{ qualifier: 'Turnos', position: 10 }]
  Nombre;
  @UI.lineItem: [{ position: 20 }]
  @UI.fieldGroup: [{ qualifier: 'Turnos', position: 20 }]
  Anyo;
  @UI.lineItem: [{ position: 30}]
  
  @UI.fieldGroup: [{ qualifier: 'Turnos', position: 30 }]
   @UI.selectionField: [{ position: 10 }]
   @Search.defaultSearchElement: true
  Dia;
  @UI.lineItem: [{ position: 40 }]
  @UI.fieldGroup: [{ qualifier: 'Turnos', position: 40  }]
  
  Hora;
  @UI.lineItem: [{ position: 50 }, { type: #FOR_ACTION, dataAction: 'pedido', label: 'Asigna Pedido', invocationGrouping:#CHANGE_SET }]
  @UI.identification: [{ position: 50 }, { type: #FOR_ACTION, dataAction: 'pedido', label: 'Asigna Pedido', invocationGrouping:#CHANGE_SET }, { type: #FOR_ACTION, dataAction: 'popupCrea', label: 'Crear turnos', invocationGrouping:#CHANGE_SET }]
  @UI.fieldGroup: [{ qualifier: 'Turnos', position: 50 }]
  @Consumption.valueHelpDefinition: [{ entity: { element: 'SalesDocument', name: 'ZSRAP_PV_I_PEDIDOS' } }]
  Vbeln;


}
</pre>
## [ZSRAP_I_CLIENTES](#core-data-services-cds)
Selección de datos de pedidos por cliente.

<pre>
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Clientes'
define root view entity ZSRAP_I_CLIENTES
  as select from kna1
  composition [0..*] of Zsrap_pv_i_pedidos as _Pedidos 
{
  key kunnr               as Partner,
      land1               as Land1,
      name1               as Name1,
      name2               as Name2,
      ort01               as Ort01,
      pstlz               as Pstlz,
      regio               as Regio,
      sortl               as Sortl,
      stras               as Stras,
      telf1               as Telf1,
      telfx               as Telfx,
      xcpdk               as Xcpdk,
      adrnr               as Adrnr,
      mcod1               as Mcod1,
      mcod2               as Mcod2,
      mcod3               as Mcod3,
      anred               as Anred,
      aufsd               as Aufsd,
      bahne               as Bahne,
      bahns               as Bahns,
      bbbnr               as Bbbnr,
      bbsnr               as Bbsnr,
      begru               as Begru,
      brsch               as Brsch,
      bubkz               as Bubkz,
      datlt               as Datlt,
      erdat               as Erdat,
      ernam               as Ernam,
      exabl               as Exabl,
      faksd               as Faksd,
      fiskn               as Fiskn,
      knazk               as Knazk,
      knrza               as Knrza,
      konzs               as Konzs,
      ktokd               as Ktokd,
      kukla               as Kukla,
      lifnr               as Lifnr,
      lifsd               as Lifsd,
      locco               as Locco,
      loevm               as Loevm,
      name3               as Name3,
      name4               as Name4,
      niels               as Niels,
      ort02               as Ort02,
      pfach               as Pfach,
      pstl2               as Pstl2,
      counc               as Counc,
      cityc               as Cityc,
      rpmkr               as Rpmkr,
      sperr               as Sperr,
      spras               as Spras,
      stcd1               as Stcd1,
      stcd2               as Stcd2,
      stkza               as Stkza,
      stkzu               as Stkzu,
      telbx               as Telbx,
      telf2               as Telf2,
      teltx               as Teltx,
      telx1               as Telx1,
      lzone               as Lzone,
      xzemp               as Xzemp,
      vbund               as Vbund,
      stceg               as Stceg,
      dear1               as Dear1,
      dear2               as Dear2,
      dear3               as Dear3,
      dear4               as Dear4,
      dear5               as Dear5,
      gform               as Gform,
      bran1               as Bran1,
      bran2               as Bran2,
      bran3               as Bran3,
      bran4               as Bran4,
      bran5               as Bran5,
      ekont               as Ekont,
      umsat               as Umsat,
      umjah               as Umjah,
      uwaer               as Uwaer,
      jmzah               as Jmzah,
      jmjah               as Jmjah,
      katr1               as Katr1,
      katr2               as Katr2,
      katr3               as Katr3,
      katr4               as Katr4,
      katr5               as Katr5,
      katr6               as Katr6,
      katr7               as Katr7,
      katr8               as Katr8,
      katr9               as Katr9,
      katr10              as Katr10,
      stkzn               as Stkzn,
      umsa1               as Umsa1,
      txjcd               as Txjcd,
      periv               as Periv,
      abrvw               as Abrvw,
      inspbydebi          as Inspbydebi,
      inspatdebi          as Inspatdebi,
      ktocd               as Ktocd,
      pfort               as Pfort,
      werks               as Werks,
      dtams               as Dtams,
      dtaws               as Dtaws,
      duefl               as Duefl,
      hzuor               as Hzuor,
      sperz               as Sperz,
      etikg               as Etikg,
      civve               as Civve,
      milve               as Milve,
      kdkg1               as Kdkg1,
      kdkg2               as Kdkg2,
      kdkg3               as Kdkg3,
      kdkg4               as Kdkg4,
      kdkg5               as Kdkg5,
      xknza               as Xknza,
      fityp               as Fityp,
      stcdt               as Stcdt,
      stcd3               as Stcd3,
      stcd4               as Stcd4,
      stcd5               as Stcd5,
      stcd6               as Stcd6,
      xicms               as Xicms,
      xxipi               as Xxipi,
      xsubt               as Xsubt,
      cfopc               as Cfopc,
      txlw1               as Txlw1,
      txlw2               as Txlw2,
      ccc01               as Ccc01,
      ccc02               as Ccc02,
      ccc03               as Ccc03,
      ccc04               as Ccc04,
      bonded_area_confirm as BondedAreaConfirm,
      donate_mark         as DonateMark,
      consolidate_invoice as ConsolidateInvoice,
      allowance_type      as AllowanceType,
      einvoice_mode       as EinvoiceMode,
      cassd               as Cassd,
      knurl               as Knurl,
      j_1kfrepre          as J1kfrepre,
      j_1kftbus           as J1kftbus,
      j_1kftind           as J1kftind,
      confs               as Confs,
      updat               as Updat,
      uptim               as Uptim,
      nodel               as Nodel,
      dear6               as Dear6,
      delivery_date_rule  as DeliveryDateRule,
      cvp_xblck           as CvpXblck,
      suframa             as Suframa,
      rg                  as Rg,
      exp                 as Exp,
      uf                  as Uf,
      rgdate              as Rgdate,
      ric                 as Ric,
      rne                 as Rne,
      rnedate             as Rnedate,
      cnae                as Cnae,
      legalnat            as Legalnat,
      crtn                as Crtn,
      icmstaxpay          as Icmstaxpay,
      indtyp              as Indtyp,
      tdt                 as Tdt,
      comsize             as Comsize,
      decregpc            as Decregpc,
      ph_biz_style        as PhBizStyle,
      paytrsn             as Paytrsn,
      kna1_eew_cust       as Kna1EewCust,
      rule_exclusion      as RuleExclusion,
      zz1_tecnologia_cus  as Zz1TecnologiaCus,
      kna1_addr_eew_cust  as Kna1AddrEewCust,
      /vso/r_palhgt       as /vso/rPalhgt,
      /vso/r_pal_ul       as /vso/rPalUl,
      /vso/r_pk_mat       as /vso/rPkMat,
      /vso/r_matpal       as /vso/rMatpal,
      /vso/r_i_no_lyr     as /vso/rINoLyr,
      /vso/r_one_mat      as /vso/rOneMat,
      /vso/r_one_sort     as /vso/rOneSort,
      /vso/r_uld_side     as /vso/rUldSide,
      /vso/r_load_pref    as /vso/rLoadPref,
      /vso/r_dpoint       as /vso/rDpoint,
      alc                 as Alc,
      pmt_office          as PmtOffice,
      fee_schedule        as FeeSchedule,
      duns                as Duns,
      duns4               as Duns4,
      sam_ue_id           as SamUeId,
      sam_eft_ind         as SamEftInd,
      psofg               as Psofg,
      psois               as Psois,
      pson1               as Pson1,
      pson2               as Pson2,
      pson3               as Pson3,
      psovn               as Psovn,
      psotl               as Psotl,
      psohs               as Psohs,
      psost               as Psost,
      psoo1               as Psoo1,
      psoo2               as Psoo2,
      psoo3               as Psoo3,
      psoo4               as Psoo4,
      psoo5               as Psoo5,
      j_1iexcd            as J1iexcd,
      j_1iexrn            as J1iexrn,
      j_1iexrg            as J1iexrg,
      j_1iexdi            as J1iexdi,
      j_1iexco            as J1iexco,
      j_1icstno           as J1icstno,
      j_1ilstno           as J1ilstno,
      j_1ipanno           as J1ipanno,
      j_1iexcicu          as J1iexcicu,
      aedat               as Aedat,
      usnam               as Usnam,
      j_1isern            as J1isern,
      j_1ipanref          as J1ipanref,
      gst_tds             as GstTds,
      j_3getyp            as J3getyp,
      j_3greftyp          as J3greftyp,
      pspnr               as Pspnr,
      coaufnr             as Coaufnr,
      j_3gagext           as J3gagext,
      j_3gagint           as J3gagint,
      j_3gagdumi          as J3gagdumi,
      j_3gagstdi          as J3gagstdi,
      lgort               as Lgort,
      kokrs               as Kokrs,
      kostl               as Kostl,
      j_3gabglg           as J3gabglg,
      j_3gabgvg           as J3gabgvg,
      j_3gabrart          as J3gabrart,
      j_3gstdmon          as J3gstdmon,
      j_3gstdtag          as J3gstdtag,
      j_3gtagmon          as J3gtagmon,
      j_3gzugtag          as J3gzugtag,
      j_3gmaschb          as J3gmaschb,
      j_3gmeinsa          as J3gmeinsa,
      j_3gkeinsa          as J3gkeinsa,
      j_3gblsper          as J3gblsper,
      j_3gkleivo          as J3gkleivo,
      j_3gcalid           as J3gcalid,
      j_3gvmonat          as J3gvmonat,
      j_3gabrken          as J3gabrken,
      j_3glabrech         as J3glabrech,
      j_3gaabrech         as J3gaabrech,
      j_3gzutvhlg         as J3gzutvhlg,
      j_3gnegmen          as J3gnegmen,
      j_3gfristlo         as J3gfristlo,
      j_3geminbe          as J3geminbe,
      j_3gfmgue           as J3gfmgue,
      j_3gzuschue         as J3gzuschue,
      j_3gschprs          as J3gschprs,
      j_3ginvsta          as J3ginvsta,
      /sapcem/dber,
      /sapcem/kvmeq,
      
      _Pedidos
     
}
</pre>

## [ZSRAP_PV_I_PEDIDOS](#core-data-services-cds)

<pre>
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Pedidos Ventas Asociados a Clientes'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity Zsrap_pv_i_pedidos
  as select from I_SalesDocumentBasic
  association to parent ZSRAP_I_CLIENTES as _Clientes on $projection.SoldToParty = _Clientes.Partner
{
  key SalesDocument,
      SalesDocumentType,
      CreatedByUser,
      CreationDate,
      @Semantics.amount.currencyCode: 'TransactionCurrency'
      TotalNetAmount,
      TransactionCurrency,
      SoldToParty,
      concat( _Clientes.Name1, _Clientes.Name2 ) as Nombre,

      _Clientes
}
</pre>


## [ZSRAP_ASIGNA_PEDIDO](#core-data-services-cds)
CDS Abstracta se utiliza como parámetros en la acción de asignación del pedido.

<pre>
@EndUserText.label: 'Abstract entity to extend the validity'
@Metadata.allowExtensions: true
define abstract entity ZSRAP_ASIGNA_PEDIDO
 // with parameters parameter_name : parameter_type 
  {
    Vbeln : vbeln;
    
}
</pre>

## [ZSRAP_ASIGNA_PEDIDO_ANOTACIONES](#core-data-services-cds)
Anotación CDS Abstracta [ZSRAP_ASIGNA_PEDIDO](#ZSRAP_ASIGNA_PEDIDO)

<pre>
@Metadata.layer: #CORE
annotate entity ZSRAP_ASIGNA_PEDIDO with
{
  @EndUserText.label: 'Pedido'
  @Consumption.valueHelpDefinition: [{ entity: { element: 'SalesDocument', name: 'ZSRAP_PV_I_PEDIDOS' } }]
  @Consumption.defaultValue: '16'
  Vbeln;
}
</pre>

## [ZSRAP_CREA_TURNOS](#core-data-services-cds)
CDS Abstracta se utiliza como parámetros en la acción de asignación del pedido.

<pre>
@EndUserText.label: 'Abstract entity to extend the validity'
@Metadata.allowExtensions: true
define abstract entity ZSRAP_CREA_TURNOS
// with parameters 
// @Environment.systemField: #SYSTEM_DATE
//  @EndUserText.label: 'Fecha Inicio P'
// p_fecha : datum
 {
     fecha_ini : datum;
     fecha_fin : datum;
     intervalo : abap.numc( 3 );
     borrar : flag;
    
}
</pre>

## [ZSRAP_CREA_TURNOS_ANOTACIONES](#core-data-services-cds)
Anotación CDS Abstracta [ZSRAP_CREA_TURNOS](#ZSRAP_CREA_TURNOS)

<pre>
@Metadata.layer: #CORE
annotate entity ZSRAP_CREA_TURNOS
    with 
{
    @EndUserText.label: 'Fecha Inicio'  
    fecha_ini;
    @EndUserText.label: 'Fecha Fin'  
    fecha_fin;
    @EndUserText.label: 'Intervalo entre Turnos (min.)'
    @Consumption.defaultValue: '30'  
    intervalo;
    @EndUserText.label: 'Borrar Turnos Existentes'    
    borrar;
    
}
</pre>


