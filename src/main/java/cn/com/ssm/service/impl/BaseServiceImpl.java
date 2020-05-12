package cn.com.ssm.service.impl;


import cn.com.ssm.mapper.*;
import cn.com.ssm.service.BaseService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *   基础公共业务层实现类
 *   此时由于没有确定泛型T的具体类型，则此类无法直接实例化，所以不需要加实例化注解
 * @param <T>  描述具体封装类型的泛型
 */
public class BaseServiceImpl<T> implements BaseService<T> {

    //注入基础的BaseMapper代理对象
    @Autowired
    protected BaseMapper<T> baseMapper;

    //注入入住信息inRoomInfoMapper对象
    @Autowired
    protected InRoomInfoMapper inRoomInfoMapper;

    //注入房间roomsMapper对象
    @Autowired
    protected RoomsMapper roomsMapper;

    //注入房销售roomSaleMapper对象
    @Autowired
   protected RoomSaleMapper roomSaleMapper;

    //注入权限authorityMapper对象
    @Autowired
    protected AuthorityMapper authorityMapper;
    /**
     *   根据条件分页查询数据
     * @param page  当前页
     * @param limit  每一页的数据条数
     * @param t  查询的条件
     * @return  分页插件的对象数据
     * @throws Exception
     */
    @Override
    public Map<String, Object> findPageByPramas(Integer page, Integer limit, T t) throws Exception {
        //新建分页的map集合对象
        Map<String,Object> map = new HashMap<String, Object>();
        //开启分页
        PageHelper.startPage(page,limit);
        //进行分页查询
        PageInfo<T> pageInfo = new PageInfo<T>(baseMapper.selectPageByPramas(t));
        //往map集合中装入相关数据
        map.put("count",pageInfo.getTotal());   //装总的数据条数  key值为："count"  千万不要改
        map.put("data",pageInfo.getList());   //装分页的对象数据   key值为："data"  千万不要改
        return map;
    }

    /**
     *   查询所有数据
     * @return  返回查询的数据集合
     * @throws Exception
     */
    @Override
    public List<T> findAll() throws Exception {
        return baseMapper.selectAll();
    }

    /**
     *   根据主键id删除单个数据
     * @param id  主键id
     * @return  删除操作结果
     * @throws Exception
     */
    @Override
    public String removeByPrimaryKey(Integer id) throws Exception {
        if(baseMapper.deleteByPrimaryKey(id)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    /**
     *   根据多个主键id批量删除数据
     * @param ids  多个主键id的数组
     * @return  操作的数据条数
     * @throws Exception
     */
    @Override
    public String removeBatchByIds(Integer[] ids) throws Exception {
        if(baseMapper.deleteBatchByIds(ids)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    /**
     *   添加数据
     * @param t  要添加的数据
     * @return  添加的操作结果
     * @throws Exception
     */
    @Override
    public String save(T t) throws Exception {
        if(baseMapper.insert(t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    /**
     *   动态修改数据
     * @param t 要修改的的数据对象
     * @return  修改的操作结果
     */
    @Override
    public String updByPrimaryKeySelective(T t) throws Exception {
        if(baseMapper.updateByPrimaryKeySelective(t)>0){
            return "success";
        }else {
            return "fail";
        }
    }
    /**
     * 根据主键动态批量修改数据
     * @param ids   主键数组
     * @param t   要修改的的数据对象
     * @return  修改的操作结果
     */
    @Override
    public String updBatchByPrimaryKeySelective(Integer[] ids, T t) throws Exception {
        if (baseMapper.updBatchByPrimaryKeySelective(ids,t)>0){
            return "success";
        }else {
            return "fail";
        }
    }

    /**
     * 根据条件查询单条数据
     * @param t  参数
     * @return  查询结果
     */
    @Override
    public T findOneByPramas(T t) throws Exception {
        return baseMapper.selectOneByPramas(t);
    }

    /**
     * 根据条件查询多条数据
     * @param t 查询条件
     * @return  查询结果
     */
    @Override
    public List<T> findManyByPramas(T t) throws Exception {
        return baseMapper.selectManyByPramas(t);
    }
    /**
     * 根据条件查询数据条数（唯一性）
     * @param t   参数
     * @return      查询的结果
     */
    @Override
    public Long findTCountByPramas(T t) throws Exception {
        return baseMapper.selectTCountByPramas(t);
    }
}
