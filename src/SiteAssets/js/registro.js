$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

async function getChoice(Select){

   return $.ajax({
            url: "https://jjnerd.sharepoint.com/sites/Dino/_api/web/lists/GetByTitle('RegistroDeOcorrencia')/fields?$filter=EntityPropertyName eq '"+ Select +"'",
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                data.d.results[0].Choices.results;
            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });
    }

    function AreasDeReporte(props) {

        const listItems = props.values.map((data, index) =>
            <option key={index.toString()}>
                {data}
            </option>
            );
        return (
        listItems
        );
    }

    function EmpresaDeReporte(props) {

        const listItems = props.values.map((data, index) =>
            <option key={index.toString()}>
                {data}
            </option>
            );
        return (
        listItems
        );
    }

    function Impacto(props) {

        const listItems = props.values.map((data, index) =>
            <option key={index.toString()}>
                {data}
            </option>
            );
        return (
        listItems
        );
    }

    // Implementar depois
    function ConfirmDeleteArea(props) {
        return (
            <div class="modal fade" id="deleteArea" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Remover Área Causadora</h4>
                </div>
                <div class="modal-body">
                    <p>Deseja Deletar Área Causadora {props.index}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary">Salvar</button>
                </div>
                </div>
            </div>
            </div>
        )
    }

    function AreaCausadora(props){
        const listCausa = props.values.slice(0).reverse().map((data, index) =>
            <tr key={index.toString()}>
                <td colspan="3">
                    <span class="arrow_box">
                        <i onClick={(e) => props.toggle(index, e)} 
                        className={"arrow " + (props.show[index] ? 'down' : 'right')}
                        ></i>
                        AreaCasudora{data}:

                        {data !== 1 &&
                            <i onClick={(e) => props.delete(data, e)}
                            class="eraser"
                            >x</i>
                        }
                    </span>
                    <table className={(props.show[index] ? 'show' : 'hidden')}>
                            <tr>
                                <td valign="top" class="ms-formlabel">
                                    <h3 class="ms-standardheader">
                                        <nobr>AreaCasudora {data}:</nobr>
                                    </h3>
                                    <select required name="Area"
                                    onChange={props.field}
                                    >
                                        <option value=""></option>
                                        <AreasDeReporte values={props.area} />
                                    </select>
                                </td>
                                <td colspan="2" valign="top" class="ms-formlabel">
                                    <h3 class="ms-standardheader">
                                        <nobr>EmpresaCausadora {data}:</nobr>
                                    </h3>
                                    <select required 
                                    // ref={props.field.textInput}
                                    >
                                        <option value=""></option>
                                        <AreasDeReporte values={props.empresa} />
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <h3 class="ms-standardheader">
                                        <nobr>Causa {data}:</nobr>
                                    </h3>
                                    <textarea row="6"
                                    // ref={props.field.textInput}
                                    ></textarea>
                                </td>
                            </tr>
                    </table>
                </td>
            </tr>
        );
        return (
            listCausa
        );        
    }

class Registro extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addCausa = this.addCausa.bind(this);
      this.deleteCausa = this.deleteCausa.bind(this);
      this.toggleTable = this.toggleTable.bind(this);
      this.getValueFieldsArea = this.getValueFieldsArea.bind(this);
      this.fields = {};
      this.fields.AreaDeReporte = React.createRef();
      this.fields.EmpresaDeReporte = React.createRef();
      this.fields.Ocorrencia = React.createRef();
      this.fields.Descricao = React.createRef();
      this.fields.Valor = React.createRef();
      this.fields.Valor0 = React.createRef();
      this.fields.Resultado = React.createRef();
      this.fields.Impacto = React.createRef();
      this.fields.AreasRelacionadas = React.createRef();
      this.fields.ComentariosGerais = React.createRef();

      this.state = {
          Areas: [],
          Empresas: [],
          Impactos: [],
          Causas: [1],
          showItems: [],
          fieldsArea: []
        };
    }

    componentDidMount() {
        const that = this;

        $.when(getChoice('AreaDeReporte'), getChoice('EmpresaDeReporte'), getChoice('Impacto')).done(function(Area, Empresa, Impacto){

            that.setState({
                Areas: Area.d.results[0].Choices.results
            });

            that.setState({
                Empresas: Empresa.d.results[0].Choices.results
            });

            that.setState({
                Impactos: Impacto.d.results[0].Choices.results
            });
        });
    }

    handleSubmit(event) {
        let payload = {};

      for (var key in this.fields) {
        if (this.fields.hasOwnProperty(key)) {
            payload[key] = this.fields[key].current.value;
        }
      }
      console.log('Payload', payload);          
      event.preventDefault();
    }

    toggleTable(index) {
        let showItems = this.state.showItems.slice(0);
            showItems[index] = !showItems[index];

            this.setState({showItems});

        event.preventDefault();
    }

   addCausa(event) {
        this.setState((state, props) => ({
            Causas: state.Causas.concat(state.Causas.length + 1)
        }));
 
        event.preventDefault();
    }

    deleteCausa(index) {
        this.setState((state, props) => ({
            Causas: state.Causas.filter((item, j) => index !== item)
        }));        

        event.preventDefault();
    }

    getValueFieldsArea(event) {
        const nameField = event.target.name
        const obj = {
            [nameField]: event.target.value,
        }

        this.setState((state, props) => ({
            fieldsArea: state.fieldsArea.concat(obj)
        }));

        setTimeout(() => {
            console.log('state: ', this.state.fieldsArea);
        },100)        
    }


    render() {
      return (

        <form onSubmit={this.handleSubmit}>       
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>AreaDeReporte:</nobr>
                    </h3>
                    <select required ref={this.fields.AreaDeReporte}>
                        <option value=""></option>
                        <AreasDeReporte values={this.state.Areas} />
                    </select>
                </td>
                <td colspan="2" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>EmpresaDeReporte:</nobr>
                    </h3>
                    <select required ref={this.fields.EmpresaDeReporte} >
                        <option value=""></option>
                        <AreasDeReporte values={this.state.Empresas} />
                    </select>
                </td>
            </tr>
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Ocorrencia:</nobr>
                    </h3>
                    <input required type="date" ref={this.fields.Ocorrencia} />
                </td>
            </tr>            
            <tr>
                <td colspan="3" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Descrição:</nobr>
                    </h3>

                    <textarea required ref={this.fields.Descricao} >
                    </textarea>
                </td>
            </tr>
            <tr>
                <td colspan="3"> <span class="icon_plus" onClick={this.addCausa}>+</span></td>
            </tr>
                <AreaCausadora 
                values={this.state.Causas} 
                area={this.state.Areas} 
                toggle={this.toggleTable} 
                delete={this.deleteCausa} 
                show={this.state.showItems} 
                field={this.getValueFieldsArea}
                empresa={this.state.Empresas} />
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Valor:</nobr>
                    </h3>

                    <input required type="text" ref={this.fields.Valor} />
                </td>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Valor0:</nobr>
                    </h3>

                    <input required type="text" ref={this.fields.Valor0} />
                </td>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Resultado:</nobr>
                    </h3>
                    <input disabled required type="text" ref={this.fields.Resultado} />
                </td>
            </tr>            
            <tr>
                <td valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>Impacto:</nobr>
                    </h3>
                    <select required ref={this.fields.Impacto} >
                        <option value=""></option>
                        <Impacto values={this.state.Impactos} />
                    </select>
                </td>
            </tr> 
            <tr>
                <td colspan="3" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>AreasRelacionadas:</nobr>
                    </h3>
                    <textarea required ref={this.fields.AreasRelacionadas} >
                    </textarea>
                </td>
            </tr>
            <tr>
                <td colspan="3" valign="top" class="ms-formlabel">
                    <h3 class="ms-standardheader">
                        <nobr>ComentariosGerais:</nobr>
                    </h3>
                    <textarea ref={this.fields.ComentariosGerais} >
                    </textarea>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="submit" value="Salvar" />
                </td>
            </tr>
        </form>
      );
    }
  }
  
  ReactDOM.render(
    <Registro />,
    document.getElementById('root')
  );