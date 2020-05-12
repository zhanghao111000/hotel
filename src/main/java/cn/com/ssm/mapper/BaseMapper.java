package cn.com.ssm.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 *   基础公共Mapper代理对象
 * @param <T>  描述具体封装类型的泛型
 */
public interface BaseMapper<T> {

    //根据主键id删除单个数据
    int deleteByPrimaryKey(Integer id) throws Exception;

    //添加
    int insert(T t) throws Exception;

    //动态添加（根据具体的字段）
    int insertSelective(T t) throws Exception;

    //根据主键id查询单个数据
    T selectByPrimaryKey(Integer id) throws Exception;

    //查询所有数据
    List<T> selectAll() throws Exception;

    //动态修改（根据具体的字段）
    int updateByPrimaryKeySelective(T t) throws Exception;

    //修改
    int updateByPrimaryKey(T t) throws Exception;

    /**
     *   根据条件分页查询数据
     * @param t  查询的条件
     * @return  员工部门的分页数据
     * @throws Exception
     */
    List<T> selectPageByPramas(@Param("t") T t) throws Exception;

    /**
     *   根据多个主键id批量删除数据
     * @param ids  多个主键id的数组
     * @return  操作的数据条数
     * @throws Exception
     */
    Integer deleteBatchByIds(@Param("ids") Integer[] ids) throws Exception;

    /**
     * 根据条件查询单条数据
     * @param t  参数
     * @return  查询结果
     */
    T selectOneByPramas(@Param("t") T t)throws Exception;

    /**
     * 根据条件查询多条数据
     * @param t 查询条件
     * @return  查询结果
     */
    List<T> selectManyByPramas(@Param("t")T t)throws Exception;

    /**
     * 根据主键动态批量修改数据
     * @param ids   主键数组
     * @param t   要修改的的数据对象
     * @return  修改的操作结果
     */
    int updBatchByPrimaryKeySelective(@Param("ids") Integer[] ids, @Param("t")T t) throws Exception;

    /**
     * 根据条件查询数据条数（唯一性）
     * @param t   参数
     * @return      查询的结果
     */
    Long selectTCountByPramas(@Param("t") T t) throws Exception;
}
