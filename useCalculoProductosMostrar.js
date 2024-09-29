import { useRef } from "react";

// Nota: llamar este hook solo dentro de un useEffect o una funcion asincrona dado que espera una referencia a un componente del DOM
// Espera una promesa que resuelve un numero entero antes de que se llame a una api para especificar total de productos que se solicitaran. (parametros de consulta)
function useCalculoProductosMostrar() {
  const prevSidebarRef = useRef(null);

  // tamaños segun la cuadricula grid de los productos
  const productoWidth = 175;
  const gap = 20;
  const productoHeight = 220;

  // requerido el contexto de la barra lateral (true o false)
  return (componenteRef, sidebar) => {
    let tiempo = sidebar ? 800 : 500; // es necesario que se espera que el sidebar termine la animación de open o cierre antes de proceder

    // Si el valor anterior de sidebar es igual al valor actual, establecer tiempo a 0
    if (prevSidebarRef.current === sidebar) {
      tiempo = 0;
    }

    // Actualizar el valor anterior de sidebar
    prevSidebarRef.current = sidebar;

    return new Promise((resolve) => {
      setTimeout(() => {
        let totalProductos = 1;

        if (componenteRef?.current) {
          const { width, height } =
            componenteRef.current.getBoundingClientRect();
          // es necesario calcular la suma total del gap para restarla del width y height disponible
          const sumaGapProductoWidth = (Math.floor(width / productoWidth) - 1) * gap;
          const sumaGapProductoHeight = (Math.floor(height / productoHeight) - 1) * gap;

          const columnas = Math.floor(
            (width - sumaGapProductoWidth) / productoWidth
          );
          const filas = Math.floor(
            (height - sumaGapProductoHeight) / productoHeight
          );

          totalProductos = filas * columnas;
        } else {
          console.error("El componente no esta montado en el DOM");
          // se ejecuta si el componente no esta montado en el DOM, solo para evitar errores por falta de referencia (Ref) del dom
          if (window.innerWidth < 1200 || window.innerHeight < 500) {
            totalProductos = 6;
          } else if (window.innerWidth > 1200 && window.innerWidth < 1800) {
            totalProductos = 8;
          } else {
            if (window.innerWidth > 1800 && window.innerHeight < 850) {
              totalProductos = 10;
            } else {
              totalProductos = 15;
            }
          }
        }

        resolve(totalProductos);
      }, tiempo);
    });
  };
}

export default useCalculoProductosMostrar;
