import React, { useState, useEffect } from 'react'
import GroupcategorysService from '../../services/layout/groupcategorys-service'
import CategorysService from '../../services/layout/categorys-service'
import { Link } from 'react-router-dom'
const Sidebar = () => {
    const [state, setState] = useState({
        groupcategorysList: [],
        categorysList: []
    })
    let groupcategorysList = []
    let categorysList = []
    const fetchData = async () => {
        try {
            groupcategorysList = await GroupcategorysService.getGroupcategorys()
            categorysList = await CategorysService.getCategorys()
        } catch (error) {
            console.log('error')
        }
        setState(s => ({ ...s, groupcategorysList, categorysList }))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className='category'>
            <div className='category__title'>
                <h4 className='category__title-name'>
                    <i className='fas fa-list-ul'></i>
                    Danh mục
                </h4>
            </div>
            <ul className='category__list'>
                {state.groupcategorysList.map(item => {
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <li className='category__list-item'>
                            <a href='#' className='category__list-link'>
                                {item.groupCategoryName}
                                <i className='fas fa-chevron-right'></i>
                                {state.categorysList.find(x => x.groupCategoryId === item.groupCategoryId) && (
                                    <ul className='sub-menu'>
                                        {state.categorysList.map(categorys => {
                                            if (categorys.groupCategoryId === item.groupCategoryId) {
                                                return (
                                                    // eslint-disable-next-line react/jsx-key
                                                    <li>
                                                        <Link
                                                            to={`category/${categorys.categoryName}/${categorys.categoryId}`}>
                                                            {categorys.categoryName}
                                                        </Link>
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                )}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Sidebar
